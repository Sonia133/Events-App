import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import RateReviewIcon from "@material-ui/icons/RateReview";

import Reviews from './Reviews';
import ReviewForm from './ReviewForm';
import AttendButton from './AttendButton';
import EditButton from "../../util/EditButton";
import { getEvent, clearErrors } from '../../redux/actions/dataActions';

const styles = {
    invisibleSeparator: {
      border: "none",
      margin: 4
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    profileImage: {
      maxWidth: 200,
      height: 200,
      objectFit: "cover",
      borderRadius: "50%"
    },
    dialogContent: {
      paddding: 20
    },
    closeButton: {
      position: "absolute",
      left: "90%"
    },
    expandButton: {
      position: "absolute",
      left: "90%"
    },
    spinnerDiv: {
      textAlign: "center",
      marginTop: 50,
      marginBottom: 50
    },
    container: {
        margin: 15
    }
};

class EventDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }
    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }
    handleOpen = () => {
        let oldPath = window.location.pathname;
        console.log(oldPath)
        const { organizer, eventId } = this.props;
        const newPath = `/users/${organizer}/event/${eventId}`;

        if (oldPath === newPath) {
            oldPath = `/users/${organizer}`;
        }

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getEvent(this.props.eventId);
    }
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);

        this.setState({ open: false })
        this.props.clearErrors();
    }
    render() {
        const {
            classes,
            event: {
              title,
              date,
              organizer,
              userImage,
              eventId,
              participantCount,
              reviewCount,
              reviews
            },
            ui: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2}></CircularProgress>
            </div>
        ) : (
            <Grid container className={classes.container}>
                <Grid item sm={5}>
                    <img src={userImage} alt="profile" className={classes.profileImage}></img>
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/users/${organizer}`}
                    >
                        @{organizer}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(date).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body1">
                        {title}
                    </Typography>
                    <AttendButton eventId={eventId} />
                    <span>{participantCount} Participants</span>
                    <EditButton tip="reviews">
                        <RateReviewIcon color="primary"></RateReviewIcon>    
                    </EditButton> 
                    <span>{reviewCount} Reviews </span>
                </Grid>
                <ReviewForm eventId={eventId} />
                <Reviews reviews={reviews} />
            </Grid>
        )
        return (
            <Fragment>
                <EditButton 
                    onClick={this.handleOpen} 
                    tip="Expand event"
                    tipClassName={classes.expandButton}
                >
                    <UnfoldMore color="primary" />
                </EditButton>
                <Dialog 
                    open={this.state.open} 
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <EditButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </EditButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

EventDialog.propTypes = {
    getEvent: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    organizer: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    event: state.data.event,
    ui: state.ui
});

const mapActionsToProps = {
    getEvent,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EventDialog));