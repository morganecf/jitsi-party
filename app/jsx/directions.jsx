export default {
    'Vestibule': {
        north: 'Literally Hell',
        west: 'Bathroom',
        east: 'Room of Disquiet'
    },
    'Literally Hell': {
        north: 'Sexy Room',
        south: 'Vestibule'
    },
    'Bathroom': {
        east: 'Vestibule'
    },
    'Room of Disquiet': {
        west: 'Vestibule'
    },
    'Sexy Room': {
        south: 'Literally Hell'
    }
}
