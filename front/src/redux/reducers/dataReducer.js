import { SUBMIT_REVIEW, SET_EVENTS, ATTEND_EVENT, UNATTEND_EVENT, LOADING_DATA, DELETE_EVENT, POST_EVENT, SET_EVENT } from '../types';

const initialState = {
    events: [],
    event: {},
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_DATA: 
            return {
                ...state,
                loading: true
            };
        case SET_EVENTS: 
            return {
                ...state,
                events: action.payload,
                loading: false
            };
        case ATTEND_EVENT:
        case UNATTEND_EVENT:
            var index = state.events.findIndex((event) => event.eventId === action.payload.eventId);
            state.events[index] = action.payload;
            if (state.event.eventId === action.payload.eventId) {
                state.event = action.payload;
            }
            return {
                ...state
            };
        case DELETE_EVENT: 
            var index = state.events.findIndex((event) => event.eventId === action.payload);
            state.events.splice(index, 1);
            return {
                ...state
            };
        case POST_EVENT:
            return {
                ...state,
                events: [
                    action.payload,
                    ...state.events
                ]
            };
        case SET_EVENT:
            return {
                ...state,
                event: action.payload,
                loading: false
            };
        case SUBMIT_REVIEW:
            return {
                ...state,
                event: {
                    ...state.event,
                    reviews: [action.payload, ...state.event.reviews]
                }
            };
        default: 
            return state;
    }
}