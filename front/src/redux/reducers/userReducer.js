import { MARK_NOTIFICATIONS_READ, ATTEND_EVENT, UNATTEND_EVENT,  SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER } from '../types';

const initialState = {
    authenticated: false,
    credentials: {},
    upcomingEvents: [],
    loading: false,
    notifications: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
                return {
                    authenticated: true,
                    loading: false,
                    ...action.payload
                };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case ATTEND_EVENT: 
            return {
                ...state,
                upcomingEvents: [
                    ...state.upcomingEvents,
                    {
                        userName: state.credentials.userName,
                        eventId: action.payload.eventId
                    }
                ]
            }
        case UNATTEND_EVENT: 
            return {
                ...state,
                upcomingEvents: state.upcomingEvents.filter((upcomingEvent) => upcomingEvent.eventId !== action.payload.eventId)
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(notification => {
                notification.read = true;
            })

            return {
                ...state
            }
        default:
            return state
    }
}