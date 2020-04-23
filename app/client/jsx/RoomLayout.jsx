import _ from 'lodash'
import adventures from './adventures'
import { pickRandom } from './utils.js'

const rooms = {
    vestibule: {
        name: 'Vestibule',
        capacity: 10,
        type: 'jitsi',
        directions: {
            north: 'Living Room',
            west: 'Closet',
            east: 'Kitchen'
        },
        map: {
            x: 11,
            y: 19,
            width: 10,
            height: 3,
            doors: {
                north: 13,
                west: 20,
                east: 20
            }
        }
    },
    closet: {
        name: 'Closet',
        capacity: 2,
        type: 'jitsi',
        description: 'A cozy closet.',
        directions: {
            east: 'Vestibule'
        },
        map: {
            x: 10,
            y: 20,
            width: 1,
            height: 2,
            doors: {
                east: 20
            }
        }
    },
    livingRoom: {
        name: 'Living Room',
        capacity: 10,
        type: 'jitsi',
        directions: {
            north: 'Serious Conversations Only',
            south: 'Vestibule',
            east: 'Art Gallery',
            west: 'Trashy Bedroom'
        },
        map: {
            x: 11,
            y: 14,
            width: 8,
            height: 5,
            doors: {
                north: 15,
                west: 15,
                east: 15,
                south: 13
            }
        }
    },
    seriousConversation: {
        name: 'Serious Conversation Only',
        capacity: 4,
        type: 'jitsi',
        directions: {
            west: 'Bathroom',
            south: 'Living Room',
            north: 'The Great Outdoors'
        },
        map: {
            x: 13,
            y: 10,
            width: 5,
            height: 4,
            doors: {
                south: 15,
                west: 12
            }
        }
    },
    bathroom: {
        name: 'bathroom',
        capacity: 2,
        type: 'jitsi',
        directions: {
            east: 'Serious Conversations Only',
            south: 'Trashy Bedroom'
        },
        map: {
            x: 9,
            y: 12,
            width: 4,
            height: 2,
            doors: {
                east: 12,
                south: 9
            }
        }
    },
    trashyBedroom: {
        name: 'Trashy Bedroom',
        capacity: 6,
        type: 'jitsi',
        directions: {
            north: 'Bathroom',
            east: 'Living Room',
            west: 'Uncomfortable Closet'
        },
        map: {
            x: 6,
            y: 14,
            width: 5,
            height: 3,
            doors: {
                north: 9,
                east: 15,
                west: 15
            }
        }
    },
    artGallery: {
        name: 'Art Gallery',
        capacity: 10,
        type: null,
        description: 'In the gallery spaces up ahead, you will find art created by your fellow Clarendonites :)',
        directions: {
            north: 'Gallery Room 1',
            west: 'Living Room',
            east: 'Kitchen'
        },
        map: {
            x: 19,
            y: 13,
            width: 4,
            height: 3,
            doors: {
                west: 15,
                north: 20,
                east: 15
            }
        }
    },
    gallery1: {
        name: 'Gallery Room 1',
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
        },
        map: {
            x: 20,
            y: 11,
            width: 2,
            height: 2,
            doors: {
                south: 20,
                north: 20
            }
        }
    },
    gallery2: {
        name: 'Gallery Room 2',
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
        },
        map: {
            x: 20,
            y: 9,
            width: 2,
            height: 2,
            doors: {
                south: 20,
                north: 20
            }
        }
    },
    gallery3: {
        name: 'Gallery Room 3',
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Untitled',
            artist: 'Francis Bacon',
            src: 'https://www.artnews.com/wp-content/uploads/2018/04/unnamed-12.jpg',
        },
        directions: {
            east: 'Gallery Room 4',
            south: 'Gallery Room 2'
        },
        map: {
            x: 20,
            y: 7,
            width: 2,
            height: 2,
            doors: {
                south: 20,
                north: 20
            }
        }
    },
    gallery4: {
        name: 'Gallery Room 4',
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Untitled',
            artist: 'Man Ray',
            src: 'https://d32dm0rphc51dk.cloudfront.net/qFljvNMqmOU4ieEHoKtU0A/large.jpg'
        },
        directions: {
            east: 'Gallery Room 5',
            west: 'Gallery Room 3'
        },
        map: {
            x: 20,
            y: 5,
            width: 2,
            height: 2,
            doors: {
                east: 5,
                south: 20
            }
        }
    },
    gallery5: {
        name: 'Gallery Room 5',
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Smiling',
            artist: 'Yue Minjun',
            src: 'https://4.bp.blogspot.com/-91KqevLK3mk/WDyVDPEshiI/AAAAAAAAAE8/aFsWvszdXH0WNWPAgODIUMZyhdLJ1HBLwCLcB/s1600/Smiling.png',
        },
        directions: {
            east: 'Gallery Room 6',
            west: 'Gallery Room 5'
        },
        map: {
            x: 22,
            y: 5,
            width: 2,
            height: 2,
            doors: {
                west: 5,
                east: 5
            }
        }
    },
    'Gallery Room 6': {
        capacity: 4,
        type: 'art',
        videoHeight: 150,
        art: {
            title: 'Smiling',
            artist: 'Yue Minjun',
            src: 'https://4.bp.blogspot.com/-91KqevLK3mk/WDyVDPEshiI/AAAAAAAAAE8/aFsWvszdXH0WNWPAgODIUMZyhdLJ1HBLwCLcB/s1600/Smiling.png',
        },
        directions: {
            south: 'Feelings',
            west: 'Gallery Room 5'
        },
        map: {
            x: 24,
            y: 5,
            width: 2,
            height: 2,
            doors: {
                west: 5,
                south: 25
            }
        }
    },
    'Feelings': {
        capacity: 6,
        type: 'jitsi',
        directions: {
            south: 'Kitchen',
        },
        map: {
            x: 24,
            y: 7,
            width: 4,
            height: 4,
            doors: {
                south: 25
            }
        }
    },
    'Kitchen': {
        capacity: 7,
        type: 'jitsi',
        directions: {
            north: 'Feelings',
            east: 'Bubble Baths',
            south: 'The Great Outdoors'
        },
        map: {
            x: 23,
            y: 11,
            width: 5,
            height: 7,
            doors: {
                north: 25,
                south: 25,
                east: 17,
                west: 15
            }
        }
    },
    'Game Room': {
        capacity: 6,
        type: 'jitsi',
        directions: {
            north: 'Kitchen',
            west: 'Vestibule',
            east: 'The Great Outdoors'
        },
        map: {
            x: 21,
            y: 18,
            width: 6,
            height: 3,
            doors: {
                north: 25,
                west: 20
            }
        }
    },
    'Bubble Baths': {
        capacity: 4,
        type: 'jitsi',
        directions: {
            west: 'Kitchen',
        },
        map: {
            x: 28,
            y: 16,
            width: 3,
            height: 3,
            doors: {
                west: 17
            }
        }
    },
    'Room 314': {
        capacity: 5,
        type: 'jitsi',
        map: {
            x: 13,
            y: 2,
            width: 4,
            height: 4
        }
    },
    'The Great Outdoors': {
        type: 'adventure',
        adventureOptions: {
            text: "Are you sure you want to leave!? Why don't you pop into a random room instead?",
            buttons: [
                {
                    text: 'Teleport me!!',
                    getNextRoom: roomLayout => {
                        const rooms = Object.keys(roomLayout).filter(
                            room => room !== 'adventure' && room !== 'redirect'
                        )
                        return pickRandom(rooms)
                    }
                },
                {
                    text: 'I want to leave >:(',
                    getNextRoom: () => 'Bye'
                }
            ]
        }
    },
    'Bye': {
        type: 'redirect',
        route: '/bye'
    },
    'Map': {
        type: 'redirect',
        route: '/map'
    }
}

adventures.forEach(adventureOptions => {
    _.merge(rooms, {
        type: 'adventure',
        adventureOptions
    })
})

export default rooms;
