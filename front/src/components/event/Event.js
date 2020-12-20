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

import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import RateReviewIcon from '@material-ui/icons/RateReview';

import AttendButton from './AttendButton';
import EditButton from '../../util/EditButton';
import DeleteEvent from './DeleteEvent';
import EventDialog from './EventDialog';

import { attendEvent, unattendEvent, uploadImageEvent } from '../../redux/actions/dataActions';

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
    imageWrapper: {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "70%",
          left: "80%"
        }
    },
    profileImage: {
        width: 160,
        height: 160,
        objectFit: "cover",
        maxWidth: "90%",
        borderRadius: "50%"
    }
}

class Event extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];
        // send to server
        const formData = new FormData();
        formData.append('image', image, image.name);

        this.props.uploadImageEvent(formData, this.props.event.eventId);
    };
    handleEditPicture = () => {
        const fileInput = document.getElementById(this.props.event.eventId);
        console.log(fileInput)
        fileInput.click();
    }
    render() {
        dayjs.extend(relativeTime);
        const { user: { authenticated, credentials: { userName } }, classes, event: { title, date, eventImage, organizer, eventId, participantCount, reviewCount } } = this.props;
        const deleteButton = authenticated && organizer === userName ? (
            <DeleteEvent eventId={eventId}/>
        ) : null;
        const editImageButton = authenticated && organizer === userName ? (
            <div>
                <input hidden="hidden" type="file" id={eventId} onChange={this.handleImageChange}></input>

                <EditButton 
                    tip="Edit event picture" 
                    onClick={this.handleEditPicture}
                    btnClassName="button"
                >
                    <PhotoCameraIcon color="primary"></PhotoCameraIcon>
                </EditButton>
            </div>
        ) : null;
        return (
           <Card className={classes.card}>
                <div className={classes.imageWrapper}>
                    <img src={eventImage} alt="profile" className={classes.profileImage}/>
                    {editImageButton}
                </div>

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
                    <EditButton tip="Reviews">
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
    classes: PropTypes.object.isRequired,
    uploadImageEvent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = {
    attendEvent,
    unattendEvent,
    uploadImageEvent
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Event));