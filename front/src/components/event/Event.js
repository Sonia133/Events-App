import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import RateReviewIcon from '@material-ui/icons/RateReview';

import AttendButton from './AttendButton';
import EditButton from '../../util/EditButton';
import DeleteEvent from './DeleteEvent';
import EventDialog from './EventDialog';

import { attendEvent, unattendEvent } from '../../redux/actions/dataActions';

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
    }
}

class Event extends Component {
    render() {
        dayjs.extend(relativeTime);
        const { user: { authenticated, credentials: { userName } }, classes, event: { title, date, userImage, organizer, eventId, participantCount, reviewCount } } = this.props;
        const deleteButton = authenticated && organizer === userName ? (
            <DeleteEvent eventId={eventId}/>
        ) : null;
        return (
           <Card className={classes.card}>
               <CardMedia
                   image={userImage}
                   title="Profile image"
                   className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/users/${organizer}`}
                        color="primary"
                    >
                        {organizer}
                    </Typography>
                    {deleteButton}
                    <Typography 
                        variant="body2" 
                        color="textSecondary"
                    >
                        {dayjs(date).fromNow()}
                    </Typography>
                    <Typography 
                        variant="body1"
                    >
                        {title}
                    </Typography>
                    <AttendButton eventId={eventId}/>
                    <span>{participantCount} Participants</span>
                    <EditButton tip="review">
                        <RateReviewIcon color="primary"></RateReviewIcon>    
                    </EditButton> 
                    <span>{reviewCount} Reviews </span>
                    <EventDialog eventId={eventId} organizer={organizer} openDialog={this.props.openDialog}/>
                </CardContent>
           </Card>
        )
    }
}

Event.propTypes = {
    attendEvent: PropTypes.func.isRequired,
    unattendEvent: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    openDialog: PropTypes.bool,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = {
    attendEvent,
    unattendEvent
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Event));