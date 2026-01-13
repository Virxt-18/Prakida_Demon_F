export const SPORTS_CONFIG = {
    Football: {
        type: "Team Sport",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 11, maxPlayers: 16 },
            { id: 'women', label: "Women's Team", minPlayers: 6, maxPlayers: 10 }
        ]
    },
    Cricket: {
        type: "Team Sport",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 11, maxPlayers: 15 },
            { id: 'women', label: "Women's Team", minPlayers: 7, maxPlayers: 11 }
        ]
    },
    Basketball: {
        type: "Team Sport",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 8, maxPlayers: 12 },
            { id: 'women', label: "Women's Team", minPlayers: 8, maxPlayers: 10 }
        ]
    },
    Volleyball: {
        type: "Team Sport",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 9, maxPlayers: 11 },
            { id: 'women', label: "Women's Team", minPlayers: 9, maxPlayers: 11 }
        ]
    },
    "Lawn Tennis": {
        type: "Team Entry",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 2, maxPlayers: 4 },
            { id: 'women', label: "Women's Team", minPlayers: 2, maxPlayers: 3 }
        ]
    },
    Badminton: {
        type: "Team Entry",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 5, maxPlayers: 8 },
            { id: 'women', label: "Women's Team", minPlayers: 5, maxPlayers: 8 }
        ]
    },
    "Table Tennis": {
        type: "Mixed",
        categories: [
            { id: 'men_team', label: "Men's Team", minPlayers: 5, maxPlayers: 8 },
            { id: 'women_team', label: "Women's Team", minPlayers: 5, maxPlayers: 8 },
            { id: 'men_single', label: "Men's Singles", minPlayers: 1, maxPlayers: 1 },
            { id: 'women_single', label: "Women's Singles", minPlayers: 1, maxPlayers: 1 },
            { id: 'mixed_double', label: "Mixed Doubles", minPlayers: 2, maxPlayers: 2 }
        ]
    },
    Carrom: {
        type: "Mixed",
        categories: [
            { id: 'men_team', label: "Men's Team (3-5 Players)", minPlayers: 3, maxPlayers: 5 },
            { id: 'women_team', label: "Women's Team (3-5 Players)", minPlayers: 3, maxPlayers: 5 },
            { id: 'mixed_double', label: "Mixed Doubles", minPlayers: 2, maxPlayers: 2 }
        ]
    },
    Chess: {
        type: "Team Entry",
        categories: [
            { id: 'men', label: "Men's Team", minPlayers: 5, maxPlayers: 8 },
            { id: 'women', label: "Women's Team", minPlayers: 5, maxPlayers: 8 }
        ]
    },
    "E-Sports": {
        type: "E-Sports",
        categories: [
            { id: 'bgmi', label: "BGMI Team", minPlayers: 4, maxPlayers: 5 },
            { id: 'free_fire', label: "Free Fire Team", minPlayers: 4, maxPlayers: 5 },
            { id: 'valorant', label: "Valorant Team", minPlayers: 5, maxPlayers: 6 }
        ]
    }
};
