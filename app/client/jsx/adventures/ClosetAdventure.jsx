import { pickRandom } from '../utils.js'

export default {
    uncomfortableCloset: {
        name: 'Uncomfortable Closet',
        text: "It's really uncomfortable in here.",
        buttons: [
            {
                text: 'Stay anyway',
                getNextRoom: () => pickRandom(['ucDrugs', 'ucTapioca', 'ucUncomfortable'])
            },
            {
                text: 'Leave',
                getNextRoom: () => 'trashyBedroom'
            }
        ]
    },
    ucDrugs: {
        text: "Might as well have some fun in this closet. Which drug do you do?",
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
                getNextRoom: () => pickRandom(['map', 'ucRamble'])
            },
            {
                text: 'Attend the court of Lady Ketamine',
                getNextRoom: () => 'ucKetamine'
            },
            {
                text: 'You are above drugs',
                getNextRoom: () => 'ucNarc'
            },
            {
                text: 'You are beyond drugs',
                getNextRoom: () => 'ucAliens'
            },
        ]
    },
    ucTapioca: {
        text: "Omg, there's a little piece of tapioca on the ground!",
        buttons: [
            {
                text: 'Eat it!',
                getNextRoom: () => 'ucBird'
            },
            {
                text: "Smell it first",
                getNextRoom: () => 'ucSmell'
            }
        ]
    },
    ucSmell: {
        text: "You lean down to smell the tapioca, and notice a faint rectangular outline on the floor. It's a trap door!",
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
    ucBird: {
        text: "You just unlocked the superpowers of a BIRD.",
        buttons: [
            {
                text: "Yeah, okay. Whatever, temporal lobe.",
                getNextRoom: () => 'trashyBedroom',
            },
            {
                text: "Sweet!",
                getNextRoom: () => 'map'
            }
        ]
    },
    ucUncomfortable: {
        text: "No, like, *really* uncomfortable. It's hot, it's small, the carpet is alarmingly damp. You hear quiet chatter outside, punctuated by the machine exhales of whipit dispensers.",
        buttons: [
            {
                text: 'Turn back now',
                getNextRoom: () => 'trashyBedroom'
            },
            {
                text: 'Endure',
                getNextRoom: () => 'ucFeelings'
            }
        ]
    },
    ucFeelings: {
        text: 'Now that you think about it, there must be some reason you came to this closet in the first place. How are you *really* feeling?',
        buttons: [
            {
                text: 'Nostalgic',
                getNextRoom: () => 'ucNostalgic'
            },
            {
                text: 'Voyeuristic',
                getNextRoom: () => 'ucSpy'
            },
            {
                text: 'Terrified',
                getNextRoom: () => 'ucTerrified'
            },
            {
                text: 'Horny',
                getNextRoom: () => 'ucHorny'
            },
            {
                text: 'Kinda sick',
                getNextRoom: () => 'bathroom'
            }
        ]
    },
    ucGHB: {
        text: "This beer tastes like industrial solvent.",
        buttons: [
            {
                text: "Throw up a little in your mouth but keep drinking",
                getNextRoom: () => 'map'
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
                getNextRoom: () => 'ucTalk'
            },
            {
                text: "That cake eating scene in Matilda",
                getNextRoom: () => 'ucTalk'
            },
            {
                text: "The sweet release of death by freak accident",
                getNextRoom: () => 'map'
            },
            {
                text: "Maps",
                getNextRoom: () => 'map'
            },
        ]
    },
    ucTalk: {
        text: "The urge to talk to and perhaps even touch a fellow human is now overwhelming.",
        buttons: [
            {
                text: "Go back to the party",
                getNextRoom: () => 'trashyBedroom'
            },
            {
                text: "Talk to yourself",
                getNextRoom: () => 'ucRamble'
            },
        ]
    },
    ucRamble: {
        text: 'You idly begin to talk to yourself. What do you say?',
        buttons: [
            {
                text: 'A catalogue of all of your sexual misdeeds, both real and imagined',
                getNextRoom: () => 'ucFeelings'
            },
            {
                text: 'lol',
                getNextRoom: () => 'ucLose'
            },
            {
                text: '"I realize now that all my life has been confined in a prison of likes and dislikes."',
                getNextRoom: () => 'map'
            }
        ]
    },
    ucSpy: {
        text: 'To kill time, you peer through the crack between closet door and wall. What are you hoping to see?',
        buttons: [
            {
                text: 'The wide expanse of night sky',
                getNextRoom: () => 'ucStars'
            },
            {
                text: 'Jackson',
                getNextRoom: () => pickRandom(['ucJackson', 'ucTrash'])
            },
            {
                text: 'Naked girls eating tapioca',
                getNextRoom: () => pickRandom(['ucTapiocaGirls', 'ucTrash'])
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
    ucTrash: {
        text: "All you can see is trash, and naked people lying atop it. Ugh. You want beauty! You want depth! You want *surprise!*",
        buttons: [
            {
                text: 'Close your eyes real tight and wish so hard for someone to take you away from all this',
                getNextRoom: () => pickRandom(['ucJackson', 'outdoors'])
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
                getNextRoom: () => 'trashyBedroom'
            },
            {
                text: 'PAAAAAAIN',
                getNextRoom: () => 'ucAliens'
            },
        ]
    },
    ucTapiocaGirls: {
        text: 'Outside the closet you can see three sexy girls eating tapioca from a bowl. They are naked.',
        buttons: [
            {
                text: 'Peace out of this lame-ass closet',
                getNextRoom: () => 'trashyBedroom',
            },
            {
                text: 'Watch them stoically',
                getNextRoom: () => 'ucFeelings'
            }
        ]
    },
    ucAliens: {
        text: "Suddenly, you feel a wave of... something... pass through your body. As if Time itself has chosen to condense inside of you and copulate with each of your internal organs. When it passes, you see a small humanoid figure in the shadows before you. Its skin is gray, its nose is absent, and its eyes are great black pools.",
        buttons: [
            {
                text: 'Try to make it happy',
                getNextRoom: () => 'ucAlienMusic'
            },
            {
                text: 'Stare at it stoically',
                getNextRoom: () => 'ucAlienAwkward'
            },
            {
                text: 'Offer it some drugs',
                getNextRoom: () => 'ucAlienThanks'
            }
        ]
    },
    ucAlienAwkward: {
        text: 'The being stares back. The vibe is becoming a little awkward, frankly.',
        buttons: [
            {
                text: 'Try to make it happy',
                getNextRoom: () => 'ucAlienMusic'
            },
            {
                text: 'Offer it some drugs',
                getNextRoom: () => 'ucAlienThanks'
            }
        ]
    },
    ucDungeon: {
        text: 'You find yourself in a subterranean vault. It smells of blood and worms. The only light you can see is a faint green glow that seems impossibly distant.',
        buttons: [
            {
                text: 'Go toward the light',
                getNextRoom: () => 'ucKetamine'
            },
            {
                text: 'Try to find your way back to the closet',
                getNextRoom: () => 'map'
            }
        ]
    },
    ucNarc: {
        text: 'You are a deep cover agent, after all. You are only here to gather information. But right now, you need a break. A spy break. How will you spend your spy break?',
        buttons: [
            {
                text: 'Dreaming of tea and crumpets',
                getNextRoom: () => 'ucLose'
            },
            {
                text: 'Dreaming of tea and crumpets',
                getNextRoom: () => 'ucLose'
            },
            {
                text: 'Dreaming of tea and crumpets',
                getNextRoom: () => 'ucLose'
            },
            {
                text: 'Doing drugs',
                getNextRoom: () => 'ucDrugs'
            }
        ]
    },
    ucKetamine: {
        text: 'Who is the stranger behind you?',
        buttons: [
            {
                text: 'Just a bunch of blinking lights that appear to be sentient',
                getNextRoom: () => 'ucAliens'
            },
            {
                text: 'The smirking specter of Lady Ketamine herself',
                getNextRoom: () => 'ucLadyK'
            },
            {
                text: 'Jackson',
                getNextRoom: () => 'ucJackson'
            },
            {
                text: 'Social anxiety',
                getNextRoom: () => 'ucTerrified'
            },
            {
                text: "It's you. It's always been you.",
                getNextRoom: () => 'map'
            }
        ]
    },
    ucAlienMusic: {
        text: 'You have your phone on you. You should play some music. What do you play?',
        buttons: [
            {
                text: 'Metal',
                getNextRoom: () => 'ucAlienThanks'
            },
            {
                text: 'Metal',
                getNextRoom: () => 'ucAlienThanks'
            },
            {
                text: 'Metal',
                getNextRoom: () => 'ucAlienThanks'
            },
            {
                text: 'Black metal',
                getNextRoom: () => 'ucAlienThanks'
            }
        ]
    },
    ucNostalgic: {
        text: 'You think back fondly to yesterday, Friday, when you...',
        buttons: [
            {
                text: '...stammeringly told a girl she was sexy, and she flashed you a wicked grin',
                getNextRoom: () => 'ucHorny'
            },
            {
                text: '...got spanked a little too hard, honestly',
                getNextRoom: () => 'ucHorny'
            },
            {
                text: '...were power-blasted with the multidimensionally unfolding realization that you never really knew what time it was, ever',
                getNextRoom: () => 'ucKetamine'
            },
            {
                text: "...made a new friend or something, whatever, I don't know",
                getNextRoom: () => 'ucFun'
            }
        ]
    },
    ucTerrified: {
        text: "That's what I thought, my dear. There, there... it's alright now. You're safe here. Safe with me. You'll always be safe, here, in my arms...",
        buttons: [
            {
                text: 'Take me home, sweet Mother...',
                getNextRoom: () => 'trashyBedroom'
            },
            {
                text: 'No! I must endure!',
                getNextRoom: () => 'map'
            }
        ]
    },
    ucAlienThanks: {
        text: 'The being accepts your offering and nods, as if in thanks. Then it takes your hand, and you feel yourself flying, flying away...',
        buttons: [
            {
                text: 'Up into the sky',
                getNextRoom: () => 'map'
            },
            {
                text: 'Down into the earth',
                getNextRoom: () => 'ucDungeon'
            }
        ]
    },
    ucLadyK: {
        text: 'She is there, Her skeletal crown glimmering in sourceless moonlight, Her silvery skin deliquescing into nightmare folds, Her breath perfectly synchronized, antiphase, with your own. After all these empty years of waiting, you finally have the chance to tell Her... how do you feel about Her?',
        buttons: [
            {
                text: 'You love her',
                getNextRoom: () => 'map'
            },
            {
                text: 'You loathe her',
                getNextRoom: () => 'ucFun'
            }
        ]
    },
    ucFun: {
        text: 'What even *is* fun?',
        buttons: [
            {
                text: "I don't know, I don't know, I DON'T KNOW",
                getNextRoom: () => 'map'
            },
            {
                text: 'Being confronted with the unknown',
                getNextRoom: () => 'ucAliens'
            },
            {
                text: 'Something I can never have',
                getNextRoom: () => 'ucTerrified'
            },
            {
                text: "Dancing like no one's watching, living every day like it's your last",
                getNextRoom: () => 'trashyBedroom'
            },
        ]
    },
    ucJackson: {
        text: 'Suddenly, everything just feels okay. Your neural tissues are flooded with GABA. Beyond the reach of your volition, a part of you tells yourself, "You got this." This can only mean one thing: Jackson is here.',
        buttons: [
            {
                text: 'Give Jackson a high five',
                getNextRoom: () => 'map'
            },
            {
                text: 'Thank Jackson for his service',
                getNextRoom: () => 'map'
            },
            {
                text: 'Say nothing. Nod stoically.',
                getNextRoom: () => 'trashyBedroom'
            },
        ]
    },
    ucLose: {
        text: "Wrong choice, bucko. That's how you *lose* this game.",
        buttons: [
            {
                text: "No, please, not again, I can't take it any—",
                getNextRoom: () => 'uncomfortableCloset'
            },
        ]
    }
}

