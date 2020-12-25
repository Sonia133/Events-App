import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppIcon from '../../images/event.png';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EventIcon from '@material-ui/icons/Event';

import Notifications from './Notifications';
import EditButton from '../../util/EditButton';
import PostEvent from '../event/PostEvent';

const styles = {
    image: {
        padding: '0 0 0 10px',
        width: '20px',
        height: '20px'
    },
    profile: {
        marginRight: '40px'
    },
    logo: {
        marginLeft: '40px'
    }
}

class Navbar extends Component {
    render() {
        const { authenticated, classes, userName } = this.props;
        return (
            <AppBar>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" className={classes.logo}>
                        <Typography>EVENTS</Typography>
                        <img src={AppIcon} alt="party" className={classes.image} />
                    </Box>
                    <Toolbar> 
                    {authenticated ? 
                    (
                        <Fragment>
                            <PostEvent/>
                            <Link to='/'>
                                <EditButton tip="Events">
                                    <EventIcon style={{ color: '#fff' }}></EventIcon>
                                </EditButton>
                            </Link>
                                <Notifications />
                        </Fragment>
                    ) 
                    : (
                        <Fragment>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/">
                                    Events
                                </Button>
                                <Button color="inherit" component={Link} to="/signup">
                                    Signup
                                </Button>
                            </Fragment>
                    )}
                    </Toolbar>
                    {authenticated ? (
                        <Link to={`/profile/${userName}`}>
                            <EditButton tip="Profile" btnClassName={classes.profile}>
                                <AccountCircleIcon style={{ color: '#fff' }} />
                            </EditButton>
                        </Link>
                    ) : (
                        <Link to='/login'>
                            <EditButton tip="Profile" btnClassName={classes.profile}>
                                <AccountCircleIcon style={{ color: '#fff' }} />
                            </EditButton>
                        </Link>
                    )}      
                </Box>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    userName: PropTypes.string,
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    userName: state.user.credentials.userName
})

export default connect(mapStateToProps)(withStyles(styles)(Navbar));
