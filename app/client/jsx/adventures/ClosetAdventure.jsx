import { pickRandom } from '../utils.js'

export default {
    'Uncomfortable Closet': {
        text: "It's really uncomfortable in here.",
        buttons: [
            {
                text: 'Stay anyway',
                getNextRoom: () => pickRandom(['Uncomfortable Closet-drugs', 'Uncomfortable Closet-tapioca'])
            },
            {
                text: 'Leave',
                getNextRoom: () => 'Trashy Bedroom'
            }
        ]
    },
    'Uncomfortable Closet-drugs': {
        text: "Might as well have fun in this closet. Which drug do you do?",
        buttons: [
            {
                text: 'Pop some molly',
                getNextRoom: () => 'Uncomfortable Closet-talk'
            },
            {
                text: 'Sip your beer',
                getNextRoom: () => pickRandom(['Uncomfortable Closet-ghb', 'Uncomfortable Closet-horny', 'Uncomfortable Closet-talk'])
            },
            {
                text: 'Sip the whip',
                getNextRoom: () => pickRandom(['Uncomfortable Closet-map', 'Uncomfortable Closet-ramble'])
            },
            {
                text: 'You are above drugs',
                getNextRoom: () => 'Uncomfortable Closet-spy'
            }
        ]
    },
    'Uncomfortable Closet-tapioca': {
        text: "Omg, there's a little piece of tapioca on the ground!",
        buttons: [
            {
                text: 'Eat it!',
                getNextRoom: () => pickRandom(['Uncomfortable Closet-bird', 'Uncomfortable Closet-tapioca-2'])
            },
            {
                text: "Smell it first",
                getNextRoom: () => 'Uncomfortable Closet-smell'
            }
        ]
    },
    'Uncomfortable Closet-smell': {
        text: "You lean down to smell the tapioca, and notice a faint rectangular outline on the floor. It's a trapdoor!",
        buttons: [
            {
                text: 'You go through it',
                getNextRoom: () => pickRandom(['Map', 'Uncomfortable Closet-dungeon'])
            },
            {
                text: 'You grab a friend to share the adventure',
                getNextRoom: () => 'Vestibule'
            }
        ]
    },
    'Uncomfortable Closet-tapioca-2': {
        text: "",
        buttons: [
            {
                text: '',
                getNextRoom: () => ''
            },
            {
                text: '',
                getNextRoom: () => ''
            }
        ]
    },
    'Uncomfortable Closet-bird': {
        text: "You just unlocked the superpowers of a BIRD.",
        buttons: [
            {
                text: "I don't believe it",
                getNextRoom: () => 'Trashy Bedroom',
            },
            {
                text: "Sweet!",
                getNextRoom: () => 'Map'
            }
        ]
    },
    'Uncomfortable Closet-ghb': {
        text: "This beer tastes like industrial solvent.",
        buttons: [
            {
                text: "Throw up a little in your mouth but keep drinking",
                getNextRoom: () => 'Uncomfortable Closet Map'
            },
            {
                text: "Run to the bathroom",
                getNextRoom: () => 'Bathroom'
            }
        ]
    },
    'Uncomfortable Closet-horny': {
        text: "You slip into an idle and horny reverie about...",
        buttons: [
            {
                text: "#clarendon-gone-wild",
                getNextRoom: () => ''
            },
            {
                text: "The surprisingly interesting nature of cement",
                getNextRoom: () => ''
            },
            {
                text: "That cake eating scene in Mathilda",
                getNextRoom: () => ''
            },
            {
                text: "Maps",
                getNextRoom: () => 'Map'
            },
        ]
    },
    'Uncomfortable Closet-talk': {
        text: "The urge to talk and perhaps even touch a fellow human is now overwhelming.",
        buttons: [
            {
                text: "Go back to the party",
                getNextRoom: () => 'Trashy Bedroom'
            },
            {
                text: "Talk to yourself",
                getNextRoom: () => ''
            },
        ]
    },
    'Uncomfortable Closet-ramble': {
        text: 'You idly begin to talk to yourself. What do you say?',
        buttons: [
            {
                text: 'You recite the beginning of Moby Dick, which you know by heart.',
                getNextRoom: () => ''
            },
            {
                text: 'Haha',
                getNextRoom: () => ''
            }
        ]
    },
    'Uncomfortable Closet-spy': {
        text: 'To kill time, you peer through the crack between closet door and wall. What are you hoping to see?',
        buttons: [
            {
                text: 'The stars',
                getNextRoom: () => 'Uncomfortable Closet-stars'
            },
            {
                text: 'Jackson',
                getNextRoom: () => ''
            },
            {
                text: 'Naked girls eating tapioca',
                getNextRoom: () => pickRandom(['Uncomfortable Closet-tapioca-girls', ''])
            }
        ]
    },
    'Uncomfortable Closet-stars': {
        text: "All you can see is trash, and naked people lying atop it. Ugh. You want fresh, clean stars! You yearn for the great outdoors!",
        buttons: [
            {
                text: 'Go outside',
                getNextRoom: () => 'The Great Outdoors',
            },
            {
                text: 'Smash your head against the wall',
                getNextRoom: () => pickRandom(['Uncomfortable Closet-bird', 'Uncomfortable Closet-pain'])
            }
        ]
    },
    'Uncomfortable Closet-pain': {
        text: "Pain......",
        buttons: [
            {
                text: 'PAIN',
                getNextRoom: () => ''
            },
            {
                text: 'PAIN',
                getNextRoom: () => ''
            },
        ]
    },
    'Uncomfortable Closet-tapioca-girls': {
        text: 'Outside the closet you can see three sexy girls eating tapioca from a bowl. They are naked.',
        buttons: [
            {
                text: '',
                getNextRoom: () => 'Trashy Bedroom',
            },
            {
                text: '',
                getNextRoom: () => ''
            }
        ]
    }
}
