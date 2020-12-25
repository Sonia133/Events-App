import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';

import axios from '../../redux/axios';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

import { logoutUser, uploadImage } from '../../redux/actions/userActions';
import { getUserPage } from '../../redux/actions/dataActions';

import Event from '../event/Event';
import EditDetails from './EditDetails';
import EditButton from '../../util/EditButton';

const styles = (theme) => ({
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative"
      },
      "& .profile-image": {
        width: 160,
        height: 160,
        objectFit: "cover",
        maxWidth: "90%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: theme.palette.primary.main
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    profileGrid: {
        marginBottom: '10px'
    },
    eventsList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    headings: {
        marginBottom: '40px',
        textAlign: 'center',
        fontWeight: '600'
    }
});

class Profile extends Component {
    state = {
        login: true
    }
    componentDidMount() {
        const userName = this.props.match.params.userName;
        
        this.props.getUserPage(userName);
        axios
          .get(`/user/${userName}`)
          .then(res => {
            this.setState({ profile: res.data.user });
          })
          .catch(err => console.log(err));
    }
    handleImageChange = (event) => {
        const image = event.target.files[0];
        // send to server
        const formData = new FormData();
        formData.append('image', image, image.name);

        this.props.uploadImage(formData);
    };
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    }
    handleLogout = () => {
        this.setState({ login: false })
        this.props.logoutUser();

        window.location.href = '/login';
    }
    render() {
        const { 
            classes, 
            user: {
                credentials: { userName, createdAt, imageUrl, about, location },
                loading,
                upcomingEvents
            },
            events
        } = this.props;

        const { login } = this.state;

        let eventsMarkup = loading ? (
            <p></p>
        ) : (events.length === 0 ? (
            <p style={{ position: 'relative', left: '45%' }}>No events posted</p>
        ) : (
            events.map(event => 
                <Grid item xs={3} key={event.eventId}>
                    <Event event={event} />
                </Grid>
            )
        ));

        let upcomingEventsMarkup = loading ? (
            <p></p>
        ) : (upcomingEvents.length === 0 ? (
                <p>No events attended</p>
        ) : (
            upcomingEvents.map(event => 
                <Typography component={Link} to={`/events/${event.eventId}`} key={`event-${event.eventId}`}>{event.title}</Typography>
            )
        ));

        let profileMarkup = !loading ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"/>
                        <input hidden="hidden" type="file" id="imageInput" onChange={this.handleImageChange}></input>
                        <EditButton 
                            tip="Edit profile picture" 
                            onClick={this.handleEditPicture}
                            btnClassName="button"
                        >
                           <PhotoCameraIcon color="primary"></PhotoCameraIcon>
                        </EditButton>

                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MuiLink component={Link} to={`/users/${userName}`} color="primary" variant="h5">
                            @{userName}
                        </MuiLink>
                        <hr/>
                        {about && <Typography variant="body2">{about}</Typography>}
                        <hr/>
                        {location && (
                            <Fragment>
                                <LocationOn color="primary" /> <span>{location}</span>
                                <hr/>
                            </Fragment>
                        )}
                        <CalendarToday color="primary"/> {' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <Tooltip title="Logout" placement="top">
                        <IconButton onClick={this.handleLogout}>
                            <KeyboardReturn color="primary"></KeyboardReturn>
                        </IconButton>
                    </Tooltip>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
            <p>Loading profile...</p>
        )
        return (
            <div>
                <Grid container className={classes.profileGrid} spacing={10}>
                    <Grid item sm>
                        {login ? profileMarkup : <p>Wait a moment...</p>}
                    </Grid>
                    <Grid item sm className={classes.eventsList}>
                        {!loading && <Typography color="primary" variant="h6" className={classes.headings}>UPCOMING EVENTS</Typography>}
                        {upcomingEventsMarkup}
                    </Grid>
                </Grid>
                {!loading && <Typography color="primary" variant="h6" className={classes.headings}>MY EVENTS</Typography>}
                <Grid container spacing={6}>
                    {eventsMarkup}
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    events: state.data.events
});

const mapActionToProps = { logoutUser, uploadImage, getUserPage };

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    events: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    getUserPage: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Profile));