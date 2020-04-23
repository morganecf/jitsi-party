import { pickRandom } from '../utils.js'

export default {
    uncomfortableCloset: {
        name: 'Uncomfortable Closet',
        text: "It's really uncomfortable in here.",
        buttons: [
            {
                text: 'Stay anyway',
                getNextRoom: () => pickRandom(['ucDrugs', 'ucTapioca'])
            },
            {
                text: 'Leave',
                getNextRoom: () => 'trashyBedroom'
            }
        ]
    },
    ucDrugs: {
        text: "Might as well have fun in this closet. Which drug do you do?",
        buttons: [
            {
                text: 'Pop some molly',
                getNextRoom: () => 'ucTalk'
            },
            {
                text: 'Sip your beer',
                getNextRoom: () => pickRandom(['ucGHB', 'ucHorny', 'ucTalk'])
            },
            {
                text: 'Sip the whip',
                getNextRoom: () => pickRandom(['ucMap', 'ucRamble'])
            },
            {
                text: 'You are above drugs',
                getNextRoom: () => 'ucSpy'
            }
        ]
    },
    ucTapioca: {
        text: "Omg, there's a little piece of tapioca on the ground!",
        buttons: [
            {
                text: 'Eat it!',
                getNextRoom: () => pickRandom(['ucBird', 'ucTapioca2'])
            },
            {
                text: "Smell it first",
                getNextRoom: () => 'ucSmell'
            }
        ]
    },
    ucSmell: {
        text: "You lean down to smell the tapioca, and notice a faint rectangular outline on the floor. It's a trapdoor!",
        buttons: [
            {
                text: 'You go through it',
                getNextRoom: () => pickRandom(['map', 'ucDungeon'])
            },
            {
                text: 'You grab a friend to share the adventure',
                getNextRoom: () => 'vestibule'
            }
        ]
    },
    ucTapioca2: {
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
    ucBird: {
        text: "You just unlocked the superpowers of a BIRD.",
        buttons: [
            {
                text: "I don't believe it",
                getNextRoom: () => 'trashyBedroom',
            },
            {
                text: "Sweet!",
                getNextRoom: () => 'map'
            }
        ]
    },
    ucGHB: {
        text: "This beer tastes like industrial solvent.",
        buttons: [
            {
                text: "Throw up a little in your mouth but keep drinking",
                getNextRoom: () => 'ucMap'
            },
            {
                text: "Run to the bathroom",
                getNextRoom: () => 'bathroom'
            }
        ]
    },
    ucHorny: {
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
                getNextRoom: () => 'map'
            },
        ]
    },
    ucTalk: {
        text: "The urge to talk and perhaps even touch a fellow human is now overwhelming.",
        buttons: [
            {
                text: "Go back to the party",
                getNextRoom: () => 'trashyBedroom'
            },
            {
                text: "Talk to yourself",
                getNextRoom: () => ''
            },
        ]
    },
    ucRamble: {
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
    ucSpy: {
        text: 'To kill time, you peer through the crack between closet door and wall. What are you hoping to see?',
        buttons: [
            {
                text: 'The stars',
                getNextRoom: () => 'ucStars'
            },
            {
                text: 'Jackson',
                getNextRoom: () => ''
            },
            {
                text: 'Naked girls eating tapioca',
                getNextRoom: () => pickRandom(['ucTapiocaGirls', ''])
            }
        ]
    },
    ucStars: {
        text: "All you can see is trash, and naked people lying atop it. Ugh. You want fresh, clean stars! You yearn for the great outdoors!",
        buttons: [
            {
                text: 'Go outside',
                getNextRoom: () => 'outdoors',
            },
            {
                text: 'Smash your head against the wall',
                getNextRoom: () => pickRandom(['ucBird', 'ucPain'])
            }
        ]
    },
    ucPain: {
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
    ucTapiocaGirls: {
        text: 'Outside the closet you can see three sexy girls eating tapioca from a bowl. They are naked.',
        buttons: [
            {
                text: '',
                getNextRoom: () => 'trashyBedroom',
            },
            {
                text: '',
                getNextRoom: () => ''
            }
        ]
    }
}
