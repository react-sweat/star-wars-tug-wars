export interface Character {
    id: string;
    name: string;
    image: string;
    side: 'dark' | 'light';
}

export const CHARACTERS: Character[] = [
    {
        id: 'darth_vader',
        name: 'Darth Vader',
        image: '/src/assets/characters/darth_vader.png',
        side: 'dark'
    },
    {
        id: 'palpatine',
        name: 'Palpatine',
        image: '/src/assets/characters/palpatine.png',
        side: 'dark'
    },
    {
        id: 'darth_maul',
        name: 'Darth Maul',
        image: '/src/assets/characters/darth_maul.png',
        side: 'dark'
    },
    {
        id: 'count_dooku',
        name: 'Count Dooku',
        image: '/src/assets/characters/count_dooku.png',
        side: 'dark'
    },
    {
        id: 'asajj_ventress',
        name: 'Asajj Ventress',
        image: '/src/assets/characters/asajj_ventress.png',
        side: 'dark'
    },
    {
        id: 'savage_opress',
        name: 'Savage Opress',
        image: '/src/assets/characters/savage_opress.png',
        side: 'dark'
    },
    {
        id: 'jango_fett',
        name: 'Jango Fett',
        image: '/src/assets/characters/jango_fett.png',
        side: 'dark'
    },
    {
        id: 'ahsoka_tano',
        name: 'Ahsoka Tano',
        image: '/src/assets/characters/ahsoka_tano.png',
        side: 'light'
    },
    {
        id: 'luke_skywalker',
        name: 'Luke Skywalker',
        image: '/src/assets/characters/luke_skywalker.png',
        side: 'light'
    },
    {
        id: 'yoda',
        name: 'Yoda',
        image: '/src/assets/characters/yoda.png',
        side: 'light'
    },
    {
        id: 'obiwankenobi',
        name: 'Obi-Wan Kenobi',
        image: '/src/assets/characters/obiwankenobi.png',
        side: 'light'
    },
    {
        id: 'anakin',
        name: 'Anakin Skywalker',
        image: '/src/assets/characters/anakin.png',
        side: 'light'
    },
    {
        id: 'mace_windu',
        name: 'Mace Windu',
        image: '/src/assets/characters/mace_windu.png',
        side: 'light'
    },
    {
        id: 'captain_rex',
        name: 'Captain Rex',
        image: '/src/assets/characters/captain_rex.png',
        side: 'light'
    },
    {
        id: 'boba_fett',
        name: 'Boba Fett',
        image: '/src/assets/characters/boba_fett.png',
        side: 'dark'
    },
    {
        id: 'general_grievous',
        name: 'General Grievous',
        image: '/src/assets/characters/general_grievous.png',
        side: 'dark'
    },
    {
        id: 'chewbacca',
        name: 'Chewbacca',
        image: '/src/assets/characters/chewbacca.png',
        side: 'light'
    },
    {
        id: 'commander_cody',
        name: 'Commander Cody',
        image: '/src/assets/characters/commander_cody.png',
        side: 'light'
    },
    {
        id: 'han_solo',
        name: 'Han Solo',
        image: '/src/assets/characters/han_solo.png',
        side: 'light'
    },
    {
        id: 'leia_organa',
        name: 'Leia Organa',
        image: '/src/assets/characters/leia_organa.png',
        side: 'light'
    },
    {
        id: 'qui_gon_jinn',
        name: 'Qui-Gon Jinn',
        image: '/src/assets/characters/qui_gon_jinn.png',
        side: 'light'
    }
];
