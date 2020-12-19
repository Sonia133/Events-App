import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = theme => ({
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
      }
    }
});
  

const StaticProfile = (props) => {
    const { classes, profile: { userName, createdAt, imageUrl, about, location }} = props;
    return (
        <Paper className={classes.paper}>
        <div className={classes.profile}>
            <div className="image-wrapper">
                <img src={imageUrl} alt="profile" className="profile-image"/>
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
        </div>
    </Paper>
    )
}

StaticProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(StaticProfile);
