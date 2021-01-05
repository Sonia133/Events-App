import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CloseIcon from '@material-ui/icons/Close';

import EditButton from '../../util/EditButton';
import DeleteEvent from './DeleteEvent';
import EventDialog from './EventDialog';

import { getEvent, clearErrors } from '../../redux/actions/dataActions';
import { attendEvent, unattendEvent, uploadImageEvent } from '../../redux/actions/dataActions';

const styles = {
    card: {
        display: 'flex',
        position: 'relative'
    },
    image: {
        minWidth: 150
    },
    title: {
        display: 'block'
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    },
    imageWrapper: {
        textAlign: "center",
        position: "relative"
    },
    profileImage: {
        width: 160,
        height: 160,
        objectFit: "cover",
        width: '90%',
        justifyContent: 'center',
        padding: '10px'
    },
    centered: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    centeredDate: {
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    div: {
        display: 'flex'
    },
    editButtons: {
        display: 'flex',
        justifyContent: 'center'
    },
    closeButton: {
      position: "absolute",
      left: "90%"
    }
}

class Event extends Component {
    state = {
        profile: false,
        hover: false,
        open: false
    }
    componentDidMount() {
        let onProfile;
        onProfile = window.location.pathname === `/profile/${this.props.user.credentials.userName}` ? true : false;

        this.setState({ profile: onProfile });
    }
    handleImageChange = (event) => {
        const image = event.target.files[0];
        console.log(image)
        // send to server
        const formData = new FormData();
        formData.append('image', image);

        this.props.uploadImageEvent(formData, this.props.event.eventId);
    };
    handleEditPicture = event => {
        event.stopPropagation();
        const fileInput = document.getElementById(`events-${this.props.event.eventId}`);
        
        fileInput.click();
    }
    mouseOver = event => {
        event.stopPropagation();

        this.setState({ hover: true });
        document.getElementById(this.props.event.eventId).style.opacity = '0.4';
        document.getElementById(this.props.event.eventId).style.cursor = 'pointer';
    }
    mouseLeave = event => {
        event.stopPropagation();

        this.setState({ hover: false });
        document.getElementById(this.props.event.eventId).style.opacity = '1.0';
        document.getElementById(this.props.event.eventId).style.cursor = 'default';
    }
    handleOpen = event => {
        event.stopPropagation();
                
        this.setState({ open: true });
        this.props.getEvent(this.props.event.eventId);
    }
    handleClose = () => {
        this.setState({ open: false });
        this.props.clearErrors();
    }
    render() {
        dayjs.extend(relativeTime);
        const { user: { authenticated, credentials: { userName } }, classes, event: { title, date, eventImage, organizer, eventId, participantCount, reviewCount } } = this.props;

        const editButtons = authenticated && organizer === userName ? (
            <div className={classes.editButtons} id={`buttons-${eventId}`}>
                <input hidden="hidden" type="file" id={`events-${eventId}`} onChange={this.handleImageChange}></input>

                <EditButton 
                    tip="Edit event picture" 
                    onClick={this.handleEditPicture}
                >
                    <PhotoCameraIcon color="primary"></PhotoCameraIcon>
                </EditButton>
                <DeleteEvent eventId={eventId}/>
            </div>
        ) : null;

        const { profile, hover, open } = this.state;

        return (
           <div className={classes.div}>
                <Card className={classes.card}>
                    <div className={classes.imageWrapper}>
                        <div onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}>
                            <img src={eventImage} id={eventId} alt="profile" className={classes.profileImage} onClick={this.handleOpen}/>
                            {hover && <Typography color="primary" variant="subtitle1" className={classes.centered}>{ title } </Typography>}
                            {hover && <Typography color="primary" variant="subtitle1" className={classes.centeredDate}>{ dayjs(date).format('DD-MM-YYYY') }</Typography>}
                        </div>
                        {profile && editButtons}
                    </div>
                </Card>
                <Dialog 
                    open={open} 
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <EditButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </EditButton>
                    <EventDialog />
                </Dialog>
            </div>
        )
    }
}

Event.propTypes = {
    getEvent: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
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
    uploadImageEvent,
    getEvent,
    clearErrors
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Event));