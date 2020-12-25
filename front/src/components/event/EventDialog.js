import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import RateReviewIcon from "@material-ui/icons/RateReview";

import Reviews from './Reviews';
import ReviewForm from './ReviewForm';
import AttendButton from './AttendButton';
import EditButton from "../../util/EditButton";

const styles = {
    invisibleSeparator: {
      border: "none",
      margin: 4
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    eventImage: {
      maxWidth: 200,
      height: 200,
      objectFit: "cover"
    },
    dialogContent: {
      paddding: 20
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
    render() {
        const {
            classes,
            event: {
              title,
              date,
              organizer,
              eventImage,
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
                    <img src={eventImage} alt="profile" className={classes.eventImage}></img>
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/events/${eventId}`}
                    >
                        {title}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography 
                        component={Link}
                        color="primary"
                        variant="subtitle1"
                        to={`/users/${organizer}`}
                    >
                        @{organizer}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(date).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <AttendButton eventId={eventId} />
                    <span>{participantCount} Participants</span>
                    <EditButton tip="Reviews">
                        <RateReviewIcon color="primary"></RateReviewIcon>    
                    </EditButton> 
                    <span>{reviewCount} Reviews </span>
                </Grid>
                <ReviewForm eventId={eventId} />
                <Reviews reviews={reviews} />
            </Grid>
        )
        return (
            <DialogContent className={classes.dialogContent}>
                {dialogMarkup}
            </DialogContent>
        )
    }
}

EventDialog.propTypes = {
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

export default connect(mapStateToProps, null)(withStyles(styles)(EventDialog));