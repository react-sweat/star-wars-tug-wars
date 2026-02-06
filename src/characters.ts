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
    }
];
