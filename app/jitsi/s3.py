import botocore.session

def format_object_url(bucket, key):
    return 'https://{0}.s3.amazonaws.com/{1}'.format(bucket, key)

def get_key(name, folder=''):
    return '/'.join([folder, name]).lstrip('/')

class Bucket:
    def __init__(self, bucket):
        self.bucket = bucket
        session = botocore.session.get_session()
        self.client = session.create_client('s3')

    def upload_photo(self, photo, name, folder=''):
        key = get_key(name, folder)
        response = self.client.put_object(
            Body=photo,
            Bucket=self.bucket,
            Key=key
        )
        status = response['ResponseMetadata']['HTTPStatusCode']
        url = format_object_url(self.bucket, key) if status == 200 else None
        return {
            'status': status,
            'url': url
        }

    def list_object_urls(self, folder=''):
        prefix = '{0}/'.format(folder) if folder else ''
        response = self.client.list_objects(
            Bucket=self.bucket,
            Prefix=prefix
        )
        urls = [
            format_object_url(self.bucket, obj['Key']) for obj in response.get('Contents', []) if obj['Key'] != prefix
        ]
        return {
            'urls': urls,
            'status': response['ResponseMetadata']['HTTPStatusCode']
        }
