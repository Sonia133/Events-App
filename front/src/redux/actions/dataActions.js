import { SUBMIT_REVIEW, STOP_LOADING_UI, POST_EVENT, DELETE_EVENT, SET_EVENTS, LOADING_DATA, ATTEND_EVENT, UNATTEND_EVENT, LOADING_UI, SET_ERRORS, CLEAR_ERRORS, SET_EVENT } from '../types';
import axios from '../axios';

export const getEvents = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/events')
        .then((res) => {
            dispatch({
                type: SET_EVENTS,
                payload: res.data
            })
        })
        .catch((err) => {
            dispatch({
                type: SET_EVENTS,
                payload: []
            })
        });
}

export const attendEvent = (eventId) => (dispatch) => {
    axios.get(`/event/${eventId}/attend`)
        .then(res => {
            dispatch({
                type: ATTEND_EVENT,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
}

export const unattendEvent = (eventId) => (dispatch) => {
    axios.get(`/event/${eventId}/unattend`)
        .then(res => {
            dispatch({
                type: UNATTEND_EVENT,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
}

export const deleteEvent = (eventId) => (dispatch) => {
    axios.delete(`/event/${eventId}`)
        .then(() => {
            dispatch({ 
                type: DELETE_EVENT,
                payload: eventId
            })
        })
        .catch(err => console.log(err))
}

export const postEvent = (newEvent) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/event', newEvent)
        .then(res => {
            dispatch({
                type: POST_EVENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
}

export const getEvent = (eventId) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/event/${eventId}`)
        .then(res => {
            console.log(res.data)
            dispatch({
                type: SET_EVENT,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI })
        })
        .catch(err => console.log(err));
}

export const submitReview = (eventId, reviewData) => dispatch =>{
    axios.post(`/event/${eventId}/review`, reviewData)
        .then(res => {
            dispatch({
                type: SUBMIT_REVIEW,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const getUserPage = (userName) => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userName}`)
        .then(res => {
            dispatch({
                type: SET_EVENTS,
                payload: res.data.events
            });
        })
        .catch(() => {
            dispatch({ type: SET_EVENTS, payload: null})
        });
};

export const uploadImageEvent = (formData, eventId)  => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.post(`event/${eventId}/image`, formData)
        .then(() => {
            dispatch(getEvents());
        })
        .catch(err => console.log(err));
}
