import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../redux/axios';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Reviews from '../components/event/Reviews';

import { getEvent } from '../redux/actions/dataActions';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
        position: 'relative'
    },
    image: {
        minWidth: 150
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    },
    profileImage: {
        width: 160,
        height: 160,
        objectFit: "cover",
        maxWidth: "90%"
    }
}

class eventInfo extends Component {
    state = {
        profile: null
    }
    componentDidMount() {
        const eventId = this.props.match.params.eventId;
        
        this.props.getEvent(eventId);
    }
    render() {
        dayjs.extend(relativeTime);
        const { classes, event: { participants, reviews, specialGuest, specialGuestInfo, info, title, date, organizer, eventId, participantCount, reviewCount, location, eventImage } } = this.props;

        let showParticipants = participantCount > 0 ? (
            participants.map(part => 
                <Typography key={part.userName}>{part.userName}</Typography>
            )
        ) : (
            <p>No participants</p>
        )

        let showReviews = reviews && reviews.length > 0 ? (
            <Reviews reviews={reviews} />
        ) : (
            <p>No reviews</p>
        )
        return (
           <Card className={classes.card}>
                <img src={eventImage} alt="profile" className={classes.profileImage}/>
                <CardContent className={classes.content}>
                    <Typography 
                    >
                       Organizer:  {organizer}
                    </Typography>
                    <Typography 
                    >
                       Location:  {location}
                    </Typography>
                    <Typography 
                    >
                        Date: {dayjs(date).format('DD-MM-YYYY')}
                    </Typography>
                    <Typography 
                    >
                        Title: {title}
                    </Typography>
                    <Typography 
                    >
                        Special guest: {specialGuest}
                    </Typography>
                    <Typography 
                    >
                        {specialGuestInfo}
                    </Typography>
                    <Typography 
                    >
                        Info about the event: {info}
                    </Typography>
                    <Typography 
                    >
                        Participants
                    </Typography>
                    {showParticipants}
                    <Typography 
                    >
                        Reviews
                    </Typography>
                    {showReviews}
                </CardContent>
           </Card>
        )
    }
}

Event.propTypes = {
    getEvent: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    event: state.data.event
});

export default connect(mapStateToProps, { getEvent })(withStyles(styles)(eventInfo));