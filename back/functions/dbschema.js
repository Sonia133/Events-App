let db = {
    users: [
        {
            userId: 'dfg486pjkunhk45',
            userName: 'user',
            email: 'user@email.com',
            createdAt: '2020-12-12T14:35:19.504Z',
            imageUrl: 'image/fhrifhrifhirir/ufifo',
            about: 'Hellooo, nice to meet you!',
            location: 'London, UK'
        }
    ],
    events: [
        {
            eventId: 'dfg486pjkunhk45',
            organizer: 'user',
            title: 'this is the scream body',
            date: '2020-12-12T14:35:19.504Z',
            participantCount: 5,
            reviewCount: 2,
            userImage: 'image/fhrifhrifhirir/ufifo',
            specialGuest: 'image/fhrifhrifhirir/ufifo',
            specialGuestInfo: 'info about special guest',
            specialGuestImage: 'image/fhrifhrifhirir/ufifo',
            info: 'info about event'
        }
    ],
    reviews: [
        {
            reviewer: 'user',
            eventId: 'dugih43467',
            body: 'nice',
            createdAt: '2020-12-12T14:35:19.504Z',
            userImage: 'image/fhrifhrifhirir/ufifo'
        }
    ],
    participants: [
        {
            userName: 'user',
            eventId: 'dugih43467'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            eventId: 'eubgruf485u0gfh',
            createdAt: '2020-12-12T14:35:19.504Z'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: 'dfg486pjkunhk45',
        userName: 'user',
        email: 'user@email.com',
        createdAt: '2020-12-12T14:35:19.504Z',
        imageUrl: 'image/fhrifhrifhirir/ufifo',
        about: 'Hellooo, nice to meet you!',
        location: 'London, UK'
    },
    participants: [
        {
            userName: 'user',
            eventId: 'dugih43467'
        },
        {
            userName: 'user',
            eventId: 'dugih43467'
        }
    ]
};