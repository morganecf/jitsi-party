export default {
    'Vestibule': {
        capacity: 10,
        type: 'jitsi',
        directions: {
            north: 'Living Room',
            west: 'Guest Book',
            east: 'Kitchen'
        }
    },
    'Guest Book': {
        capacity: 1,
        type: null,
        description: 'Add a note to the guest book!',
        directions: {
            east: 'Vestibule'
        }
    },
    'Living Room': {
        capacity: 10,
        type: 'jitsi',
        directions: {
            north: 'Serious Conversation Only',
            south: 'Vestibule',
            east: 'Art Gallery',
            west: 'Trashy Bedroom'
        }
    },
    'Serious Conversation Only': {
        capacity: 4,
        type: 'jitsi',
        directions: {
            west: 'Bathroom',
            south: 'Living Room',
            north: 'The Great Outdoors'
        }
    },
    'Bathroom': {
        capacity: 2,
        type: 'jitsi',
        directions: {
            east: 'Serious Conversations Only',
            south: 'Trashy Bedroom'
        }
    },
    'Trashy Bedroom': {
        capacity: 6,
        type: 'jitsi',
        directions: {
            north: 'Bathroom',
            east: 'Living Room'
        }
    },
    'Art Gallery': {
        capacity: 10,
        type: null,
        description: 'In the gallery spaces up ahead, you will find art created by your fellow Clarendonites :)',
        directions: {
            north: 'Gallery Room 1',
            west: 'Living Room',
            east: 'Feelings'
        }
    },
    'Gallery Room 1': {
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Light',
            artist: 'James Turrell',
            src: 'https://i.guim.co.uk/img/media/cf62885d3e390035b2ccaeddc7937d9245739ca0/0_0_2048_1536/master/2048.jpg?width=700&quality=85&auto=format&fit=max&s=11e39c32b0b94498d3ee524d1bc9a38e'
        },
        directions: {
            north: 'Gallery Room 2',
            south: 'Art Gallery'
        }
    },
    'Gallery Room 2': {
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Flaming June',
            artist: 'Frederic Lord Leighton',
            src: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Flaming_June%2C_by_Frederic_Lord_Leighton_%281830-1896%29.jpg'
        },
        directions: {
            north: 'Gallery Room 3',
            south: 'Gallery Room 1'
        }
    },
    'Gallery Room 3': {
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Untitled',
            artist: 'Francis Bacon',
            src: 'https://www.artnews.com/wp-content/uploads/2018/04/unnamed-12.jpg',
        },
        directions: {
            north: 'Gallery Room 4',
            south: 'Gallery Room 2'
        }
    },
    'Gallery Room 4': {
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Untitled',
            artist: 'Man Ray',
            src: 'https://d32dm0rphc51dk.cloudfront.net/qFljvNMqmOU4ieEHoKtU0A/large.jpg'
        },
        directions: {
            north: 'Gallery Room 5',
            south: 'Gallery Room 3'
        }
    },
    'Gallery Room 5': {
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Smiling',
            artist: 'Yue Minjun',
            src: 'https://4.bp.blogspot.com/-91KqevLK3mk/WDyVDPEshiI/AAAAAAAAAE8/aFsWvszdXH0WNWPAgODIUMZyhdLJ1HBLwCLcB/s1600/Smiling.png',
        },
        directions: {
            north: 'Punishment Corner',
            south: 'Gallery Room 4'
        }
    },
    'Punishment Corner': {
        capacity: 5,
        type: 'jitsi',
        directions: {
            south: 'Feelings'
        }
    },
    'Feelings': {
        capacity: 6,
        type: 'jitsi',
        directions: {
            north: 'Punishment Corner',
            south: 'Kitchen',
            west: 'Art Gallery',
            east: 'Bubble Baths'
        }
    },
    'Kitchen': {
        capacity: 7,
        type: 'jitsi',
        directions: {
            north: 'Feelings',
            east: 'Literally Hell',
            west: 'Vestibule'
        }
    },
    'Literally Hell': {
        capacity: 6,
        type: 'jitsi',
        directions: {
            west: 'Kitchen',
            north: 'Bubble Baths',
            south: 'The Great Outdoors',
            east: 'The Great Outdoors'
        }
    },
    'Bubble Baths': {
        capacity: 4,
        type: 'jitsi',
        directions: {
            west: 'Feelings',
            south: 'Literally Hell'
        }
    },
    'The Great Outdoors': {
        type: 'adventure',
        adventureOptions: {
            text: "Are you sure you want to leave!? Why don't you pop into a random room instead?",
            buttons: [
                {
                    text: 'Ok',
                    getNextRoom: roomLayout => {
                        const rooms = Object.keys(roomLayout).filter(
                            room => room !== 'The Great Outdoors' && room !== 'Bye'
                        )
                        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)]
                        return randomRoom
                    }
                },
                {
                    text: 'I want to leave!',
                    getNextRoom: () => 'Bye'
                }
            ]
        },
        directions: {}
    },
    'Bye': {
        type: 'redirect',
        route: '/bye'
    }
}
