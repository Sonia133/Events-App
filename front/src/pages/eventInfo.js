import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../redux/axios';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import Reviews from '../components/event/Reviews';
import EditButton from '../util/EditButton';

import { getEvent, clearErrors } from '../redux/actions/dataActions';

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
    },
    closeButton: {
      position: "absolute",
      left: "90%"
    },
    imagePosition: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

class eventInfo extends Component {
    state = {
        profile: null,
        open: false
    }
    componentDidMount() {
        const eventId = this.props.match.params.eventId;
        
        this.props.getEvent(eventId);
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
        const { ui: { loading }, classes, event: { reviews, specialGuest, specialGuestInfo, info, title, date, organizer, location, eventImage } } = this.props;
        const { open } = this.state;

        let showReviews = reviews && reviews.length > 0 ? (
            <Reviews reviews={reviews} />
        ) : (
            <p>No reviews</p>
        )

        return (
           <Card className={classes.card} style={{ width: '80%', margin: 'auto' }}>
                {loading ? <p style={{ margin: '20px' }}>Wait a moment...</p> : (
                    <Grid container>
                        <Grid item sm>
                            <CardContent className={classes.content}>
                                <Typography variant="h3" style={{ marginBottom: '10px' }}>{title}</Typography>
                                <Typography>Organizer: {organizer}</Typography>
                                <Typography>Date: {date}</Typography>
                                <Typography>Location: {location}</Typography>
                                <Typography>Description: {info}</Typography>
                                <Typography>Special guest: {specialGuest}</Typography>
                                <Typography>{specialGuestInfo}</Typography>
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    <Typography 
                                    >
                                        Reviews
                                    </Typography>
                                    <EditButton 
                                        tip="Reviews" 
                                        onClick={this.handleOpen}
                                    >
                                        <AddIcon color="primary"></AddIcon>
                                    </EditButton>
                                </div>
                                <Dialog 
                                    open={open} 
                                    onClose={this.handleClose}
                                    fullWidth
                                    maxWidth="sm"
                                >
                                    <EditButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                                        <CloseIcon />
                                    </EditButton>
                                    <DialogContent>
                                        {showReviews}
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Grid>
                        <Grid item sm className={classes.imagePosition}>
                            <img src={eventImage} alt="profile" className={classes.profileImage}/>
                        </Grid>
                    </Grid>)     
                }
           </Card>
        )
    }
}

Event.propTypes = {
    getEvent: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    event: state.data.event,
    ui: state.ui
});

export default connect(mapStateToProps, { getEvent, clearErrors })(withStyles(styles)(eventInfo));