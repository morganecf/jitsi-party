#! /usr/bin/env python

from dataclasses import dataclass
import os
import random
import string
from time import sleep
from typing import Dict, Iterator, Set

import boto3
import click
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError


SYNC_MAP = {
    "october-1st-cats": "Oct1Cats",
    "october-events-full-pass": "OctFullPass",
    "temple-10-05": "TempleOctober5",
    "october-8th-death": "Oct8Death",
    "temple-10-12": "TempleOctober12",
    "october-15th-monsters": "Oct15Monsters",
    "temple-10-19": "TempleOctober19",
}


@dataclass(frozen=True)
class ShopifyOrder:
    email: str
    product_handles: Set[str]
    processed_at: str


def get_aws_users(client, user_pool_id: str) -> Iterator[str]:
    for page in client.get_paginator("list_users").paginate(
        UserPoolId=user_pool_id,
        AttributesToGet=["email"],
    ):
        for user in page["Users"]:
            user_attributes = {a["Name"]: a["Value"] for a in user["Attributes"]}

            yield user_attributes["email"].lower()


def get_shopify_orders(
    client,
    num_items: int,
    num_pages: int,
    orders_per_page: int,
    request_backoff_seconds: int,
) -> Iterator[ShopifyOrder]:
    query = gql(
        """
        query getOrders ($num_items: Int, $cursor: String, $orders_per_page: Int) {
            orders(first: $orders_per_page, reverse: true, after: $cursor) {
                edges {
                    cursor,
                    node {
                        id,
                        processedAt,
                        customer {
                            email
                        },
                        lineItems(first: $num_items) {
                            edges {
                                node {
                                    product {
                                        handle
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        """
    )

    cursor = None
    for _ in range(num_pages):
        print(f"Fetching page of {orders_per_page} orders...")
        result = client.execute(
            query,
            variable_values={
                "num_items": num_items,
                "cursor": cursor,
                "orders_per_page": orders_per_page,
            },
        )

        for edge in result["orders"]["edges"]:
            cursor = edge["cursor"]
            email = edge["node"]["customer"]["email"]
            product_handles = set(
                e["node"]["product"]["handle"]
                for e in edge["node"]["lineItems"]["edges"]
                if e["node"]["product"] is not None
            )
            processed_at = edge["node"]["processedAt"]

            yield ShopifyOrder(
                email=email,
                product_handles=product_handles,
                processed_at=processed_at,
            )

        sleep(request_backoff_seconds)


def send_slack_message(client, message: str) -> None:
    channel_name = "auth"
    channel_id = None

    for result in client.conversations_list():
        if channel_id is not None:
            break
        for channel in result["channels"]:
            if channel["name"] == channel_name:
                channel_id = channel["id"]
                break

    if channel_id is None:
        raise RuntimeError("Couldn't find channel")

    client.chat_postMessage(channel=channel_id, text=message)
    print("Message sent!")


def generate_temporary_password() -> str:
    return "".join(random.choice(string.ascii_letters) for _ in range(20)) + "".join(
        random.choice(string.digits) for _ in range(3)
    )


def create_aws_user(client, user_pool_id: str, email: str) -> None:
    response = client.admin_create_user(
        UserPoolId=user_pool_id,
        Username=email,
        UserAttributes=[
            {"Name": "email_verified", "Value": "True"},
            {"Name": "email", "Value": email},
        ],
        TemporaryPassword=generate_temporary_password(),
        DesiredDeliveryMediums=["EMAIL"],
    )

    assert response["ResponseMetadata"]["HTTPStatusCode"] == 200


def delete_aws_user(client, user_pool_id: str, email: str) -> None:
    response = client.admin_delete_user(
        UserPoolId=user_pool_id,
        Username=email,
    )

    assert response["ResponseMetadata"]["HTTPStatusCode"] == 200


def add_aws_user_to_group(client, user_pool_id: str, user: str, group: str) -> None:
    response = client.admin_add_user_to_group(
        UserPoolId=user_pool_id,
        Username=user,
        GroupName=group,
    )

    assert response["ResponseMetadata"]["HTTPStatusCode"] == 200


@click.group()
def cli():
    pass


@cli.command()
@click.argument("email", type=str)
def create_user(email: str) -> None:
    """Create Cognito user"""
    client = boto3.client("cognito-idp")
    user_pool_id = os.environ["AWS_COGNITO_USER_POOL_ID"]
    create_aws_user(client, user_pool_id, email)
    print("User created!")


@cli.command()
@click.argument("email", type=str)
def delete_user(email: str) -> None:
    """Delete Cognito user"""
    client = boto3.client("cognito-idp")
    user_pool_id = os.environ["AWS_COGNITO_USER_POOL_ID"]

    delete_aws_user(client, user_pool_id, email)
    print("User deleted!")


@cli.command()
@click.argument("user", type=str)
@click.argument("group", type=str)
def add_user_to_group(user: str, group: str) -> None:
    """Add Cognito user to group"""
    client = boto3.client("cognito-idp")
    user_pool_id = os.environ["AWS_COGNITO_USER_POOL_ID"]

    add_aws_user_to_group(client, user_pool_id, user, group)
    print("User added to group!")


@cli.command()
@click.argument("message", type=str)
def send_message(message: str) -> None:
    """Send a message to Slack"""

    client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
    send_slack_message(client, message)


@cli.command()
@click.option(
    "--num-items",
    default=5,
    help="number of items per order to scan",
    show_default=True,
)
@click.option(
    "--num-pages",
    default=10,
    help="number of pages of orders to request",
    show_default=True,
)
@click.option(
    "--orders-per-page",
    default=50,
    help="number of orders per page",
    show_default=True,
)
@click.option(
    "--request-backoff-seconds",
    default=5,
    help="seconds between requests",
    show_default=True,
)
def get_orders(
    num_items: int,
    num_pages: int,
    orders_per_page: int,
    request_backoff_seconds: int,
) -> None:
    """Get orders from Shopify"""

    shopify_key = os.environ["SHOPIFY_KEY"]
    shopify_pass = os.environ["SHOPIFY_PASS"]
    transport = AIOHTTPTransport(
        url=f"https://{shopify_key}:{shopify_pass}@tstvhq.myshopify.com/admin/api/2021-04/graphql.json"
    )
    shopify_client = Client(transport=transport, fetch_schema_from_transport=True)

    orders = get_shopify_orders(
        shopify_client,
        num_items,
        num_pages,
        orders_per_page,
        request_backoff_seconds,
    )
    for order in orders:
        print(order)


@cli.command()
def get_users() -> None:
    """Get Cognito users"""

    aws_client = boto3.client("cognito-idp")
    user_pool_id = os.getenv("AWS_COGNITO_USER_POOL_ID")

    users = get_aws_users(aws_client, user_pool_id)
    for user in users:
        print(user)


@cli.command()
@click.option(
    "--num-items",
    default=5,
    help="number of items per order to scan",
    show_default=True,
)
@click.option(
    "--num-pages",
    default=4,
    help="number of pages of orders to request",
    show_default=True,
)
@click.option(
    "--orders-per-page",
    default=50,
    help="number of orders per page",
    show_default=True,
)
@click.option(
    "--request-backoff-seconds",
    default=6,
    help="seconds between requests",
    show_default=True,
)
@click.option("--dry-run/--no-dry-run", default=False)
def sync(
    num_items: int,
    num_pages: int,
    orders_per_page: int,
    request_backoff_seconds: int,
    dry_run: bool,
) -> None:
    """Sync users from Shopify to Cognito"""

    shopify_key = os.environ.get("SHOPIFY_KEY")
    shopify_pass = os.environ.get("SHOPIFY_PASS")
    transport = AIOHTTPTransport(
        url=f"https://{shopify_key}:{shopify_pass}@tstvhq.myshopify.com/admin/api/2021-04/graphql.json"
    )
    shopify_client = Client(transport=transport, fetch_schema_from_transport=True)

    aws_client = boto3.client("cognito-idp")
    user_pool_id = os.getenv("AWS_COGNITO_USER_POOL_ID")

    slack_client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))

    orders = get_shopify_orders(
        shopify_client, num_items, num_pages, orders_per_page, request_backoff_seconds
    )
    current_users = list(get_aws_users(aws_client, user_pool_id))

    new_users: Set[str] = set()
    user_groups: Dict[str, Set[str]] = {}

    for order in orders:
        if len(order.product_handles.intersection(SYNC_MAP.keys())) > 0:
            if order.email not in current_users:
                new_users.add(order.email.lower())

            if order.email not in user_groups.keys():
                user_groups[order.email] = set()
            groups = user_groups[order.email]

            for handle in order.product_handles:
                if handle in SYNC_MAP.keys():
                    groups.add(SYNC_MAP[handle])

    print(f"Adding {len(new_users)} new users")
    print(f"Adding {len(user_groups.keys())} users to groups")

    if dry_run:
        return

    for user in new_users:
        print(f"Creating user {user}")
        create_aws_user(aws_client, user_pool_id, user)

        sleep(1)

    for user, groups in user_groups.items():
        for group in groups:
            print(f"Adding {user} to {group}")
            add_aws_user_to_group(aws_client, user_pool_id, user, group)

            sleep(1)

    send_slack_message(
        slack_client,
        f"Created {len(new_users)} new users and added {len(user_groups.keys())} users to groups",
    )


if __name__ == "__main__":
    cli()
