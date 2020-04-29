import _ from 'lodash'
import adventures from './adventures'
import { pickRandom } from './utils.js'

const rooms = {
    vestibule: {
        name: 'Vestibule',
        capacity: 10,
        type: 'jitsi',
        description: 'Welcome!',
        directions: {
            north: 'livingRoom',
            west: 'closet',
            east: 'gameRoom'
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
        muteRoom: true,
        description: 'A quiet, cozy closet.',
        directions: {
            east: 'vestibule'
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
            north: 'danceParty',
            south: 'vestibule',
            east: 'artGallery',
            west: 'trashyBedroom'
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
    danceParty: {
        name: 'Dance Party',
        capacity: 15,
        iframeOptions: {
            src: 'https://player.twitch.tv/?channel=djdepolo&parent=jitsi.gbre.org',
        },
        type: 'iframe',
        directions: {
            west: 'bathroom',
            south: 'livingRoom',
            north: 'outdoors'
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
        name: 'Bathroom',
        capacity: 2,
        type: 'jitsi',
        description: 'A cozy bathroom.',
        directions: {
            east: 'danceParty',
            south: 'trashyBedroom'
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
        description: "Let's get fucked uppp",
        directions: {
            north: 'bathroom',
            east: 'livingRoom',
            west: 'uncomfortableCloset'
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
            north: 'gallery1',
            west: 'livingRoom',
            east: 'kitchen'
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
        art: {
            title: 'Bread',
            artist: 'Jett',
            src: './js/images/bread-jett.png'
        },
        directions: {
            north: 'gallery2',
            south: 'artGallery'
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
        art: {
            title: 'Butterfly Girl',
            artist: 'LaRen',
            src: './js/images/butterfly-girl-laren.jpg'
        },
        directions: {
            north: 'gallery3',
            south: 'gallery1'
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
        art: {
            title: 'Creazione di DJ',
            artist: 'Phoebe',
            src: './js/images/creazione-di-gatto.jpg',
        },
        directions: {
            north: 'gallery4',
            south: 'gallery2'
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
        art: {
            title: 'Champagne',
            artist: 'Lolo',
            src: './js/images/champagne-lolo.gif'
        },
        directions: {
            north: 'gallery5',
            south: 'gallery3'
        },
        map: {
            x: 20,
            y: 5,
            width: 2,
            height: 2,
            doors: {
                north: 20,
                south: 20
            }
        }
    },
    gallery5: {
        name: 'Gallery Room 5',
        capacity: 4,
        type: 'art',
        art: {
            title: 'Prints',
            artist: 'Brett',
            src: './js/images/prints-by-brett.png',
        },
        directions: {
            north: 'gallery6',
            south: 'gallery4'
        },
        map: {
            x: 20,
            y: 3,
            width: 2,
            height: 2,
            doors: {
                south: 20,
                east: 3
            }
        }
    },
    gallery6: {
        name: 'Gallery Room 6',
        capacity: 4,
        type: 'art',
        art: {
            title: 'Origami',
            artist: 'Kevin',
            src: './js/images/origami-kevin.jpg',
        },
        directions: {
            north: 'gallery7',
            south: 'gallery5'
        },
        map: {
            x: 22,
            y: 3,
            width: 2,
            height: 2,
            doors: {
                west: 3,
                east: 3
            }
        }
    },
    gallery7: {
        name: 'Gallery Room 7',
        capacity: 4,
        type: 'art',
        art: {
            title: 'Phoebe',
            artist: 'Sean A',
            src: './js/images/phoebe-by-sean.png',
        },
        directions: {
            south: 'gallery6',
            north: 'gallery8'
        },
        map: {
            x: 24,
            y: 3,
            width: 2,
            height: 2,
            doors: {
                east: 3,
                west: 3
            }
        }
    },
    gallery8: {
        name: 'Gallery Room 8',
        capacity: 4,
        type: 'art',
        art: {
            title: 'Dildos United & Hitachi Quilt',
            artist: 'Alex',
            src: './js/images/alex-art.png',
        },
        directions: {
            south: 'gallery7',
            north: 'gallery9'
        },
        map: {
            x: 26,
            y: 3,
            width: 2,
            height: 2,
            doors: {
                west: 3,
                south: 27
            }
        }
    },
    gallery9: {
        name: 'Gallery Room 9',
        capacity: 4,
        type: 'art',
        art: {
            title: 'The Squeak of Reason II',
            artist: 'Morg',
            src: './js/images/squeak-of-reason.jpg',
        },
        directions: {
            south: 'gallery8',
            north: 'feelings'
        },
        map: {
            x: 26,
            y: 5,
            width: 2,
            height: 2,
            doors: {
                north: 27,
                south: 27
            }
        }
    },
    feelings: {
        name: 'Feelings',
        capacity: 6,
        type: 'jitsi',
        description: 'Talk about your feelings, I guess.',
        directions: {
            south: 'kitchen',
            east: 'boudoir'
        },
        map: {
            x: 24,
            y: 7,
            width: 4,
            height: 4,
            doors: {
                south: 25,
                east: 10
            }
        }
    },
    boudoir: {
        name: 'Boudoir',
        capacity: 5,
        type: 'jitsi',
        description: 'Get dolled up',
        directions: {
            west: 'feelings',
            south: 'bunnyRun',
        },
        map: {
            x: 28,
            y: 9,
            width: 2,
            height: 2,
            doors: {
                west: 10,
                south: 29
            }
        }
    },
    bunnyRun: {
        name: 'The Bunny Run',
        capacity: 10,
        type: 'jitsi',
        description: 'The Winston & Winona show',
        directions: {
            north: 'boudoir'
        },
        map: {
            x: 28,
            y: 11,
            width: 2,
            height: 1,
            doors: {
                north: 29
            }
        }
    },
    kitchen: {
        name: 'Kitchen',
        capacity: 7,
        type: 'jitsi',
        description: "Let's cook something!",
        directions: {
            north: 'feelings',
            east: 'bubbleBaths',
            south: 'gameRoom',
            west: 'artGallery'
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
    gameRoom: {
        name: 'Game Room',
        capacity: 6,
        type: 'iframe',
        iframeOptions: {
            src: "http://threesjs.com/",
        },
        directions: {
            north: 'kitchen',
            west: 'vestibule',
            east: 'outdoors'
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
    bubbleBaths: {
        name: 'Bubble Baths',
        capacity: 4,
        type: 'jitsi',
        directions: {
            west: 'kitchen',
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
    room314: {
        name: 'Room 314',
        capacity: 5,
        type: 'jitsi',
        map: {
            x: 13,
            y: 2,
            width: 4,
            height: 4
        },
        directions: {
            north: 'vestibule'
        }
    },
    outdoors: {
        name: 'The Great Outdoors',
        type: 'adventure',
        adventureOptions: {
            text: "Are you sure you want to leave!? Why don't you pop into a random room instead?",
            buttons: [
                {
                    text: 'Teleport me!!',
                    getNextRoom: roomLayout => {
                        // Allows you to go to any room plus the map
                        const rooms = Object.keys(roomLayout).filter(
                            room => roomLayout[room].type !== 'adventure' && room !== 'bye'
                        )
                        return pickRandom(rooms)
                    }
                },
                {
                    text: 'I want to leave >:(',
                    getNextRoom: () => 'bye'
                }
            ]
        }
    },
    bye: {
        name: 'Bye',
        type: 'redirect',
        route: '/bye'
    },
    map: {
        name: 'Map',
        type: 'redirect',
        route: '/map'
    }
}

adventures.forEach(adventure => {
    Object.keys(adventure).forEach(key => {
        rooms[key] = {
            name: adventure[key].name,
            type: 'adventure',
            adventureOptions: adventure[key]
        }
    })
})

export default rooms;
