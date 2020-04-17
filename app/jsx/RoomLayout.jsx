export default {
    'Vestibule': {
        capacity: 10,
        isJitsi: true,
        directions: {
            north: 'Living Room',
            west: 'Guest Book',
            east: 'Kitchen'
        }
    },
    'Guest Book': {
        capacity: 1,
        isJitsi: false,
        description: 'Add a note to the guest book!',
        directions: {
            east: 'Vestibule'
        }
    },
    'Living Room': {
        capacity: 10,
        isJitsi: true,
        directions: {
            north: 'Serious Conversation Only',
            south: 'Vestibule',
            east: 'Art Gallery',
            west: 'Trashy Bedroom'
        }
    },
    'Serious Conversation Only': {
        capacity: 4,
        isJitsi: true,
        directions: {
            west: 'Bathroom',
            south: 'Living Room',
            north: 'The Great Outdoors'
        }
    },
    'Bathroom': {
        capacity: 2,
        isJitsi: true,
        directions: {
            east: 'Serious Conversations Only',
            south: 'Trashy Bedroom'
        }
    },
    'Trashy Bedroom': {
        capacity: 6,
        isJitsi: true,
        directions: {
            north: 'Bathroom',
            east: 'Living Room'
        }
    },
    'Art Gallery': {
        capacity: 10,
        isJitsi: false,
        description: 'In the gallery spaces up ahead, you will find art created by your fellow Clarendonites :)',
        directions: {
            north: 'Gallery Room 1',
            west: 'Living Room',
            east: 'Friends'
        }
    },
    'Gallery Room 1': {
        capacity: 4,
        isJitsi: true,
        videoHeight: 100,
        art: {
            title: 'Untitled',
            artist: 'Unknown',
            src: 'https://4.bp.blogspot.com/-91KqevLK3mk/WDyVDPEshiI/AAAAAAAAAE8/aFsWvszdXH0WNWPAgODIUMZyhdLJ1HBLwCLcB/s1600/Smiling.png'
        },
        directions: {
            north: 'Gallery Room 2',
            south: 'Art Gallery'
        }
    },
    'Gallery Room 2': {
        capacity: 4,
        isJitsi: true,
        videoHeight: 100,
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
        isJitsi: true,
        videoHeight: 100,
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
        isJitsi: true,
        videoHeight: 100,
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
        isJitsi: true,
        videoHeight: 100,
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
        isJitsi: true,
        directions: {
            south: 'Friends'
        }
    },
    'Friends': {
        capacity: 6,
        isJitsi: true,
        directions: {
            north: 'Punishment Corner',
            south: 'Kitchen',
            west: 'Art Gallery',
            east: 'Bubble Baths'
        }
    },
    'Kitchen': {
        capacity: 7,
        isJitsi: true,
        directions: {
            north: 'Friends',
            east: 'Literally Hell',
            west: 'Vestibule'
        }
    },
    'Literally Hell': {
        capacity: 6,
        isJitsi: true,
        directions: {
            west: 'Kitchen',
            north: 'Bubble Baths',
            south: 'The Great Outdoors',
            east: 'The Great Outdoors'
        }
    },
    'Bubble Baths': {
        capacity: 4,
        isJitsi: true,
        directions: {
            west: 'Friends',
            south: 'Literally Hell'
        }
    }
}
