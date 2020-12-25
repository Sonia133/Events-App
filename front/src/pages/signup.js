import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import AppIcon from '../images/event.png';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = {
    form: {
        marginTop: '30px',
        width: '40%'
    },
    page: {
        textAlign: 'center',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    image: {
        width: '40px',
        height: '40px'
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        marginTop: '10px',
        marginBottom: '5px',
        position: 'relative',
        width: '30%'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '10px'
    },
    progress: {
        position: 'absolute'
    },
    fields: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center'
    }
}

class signup extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            userName: '',
            errors: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ui.errors) {
          this.setState({ errors: nextProps.ui.errors });
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            userName: this.state.userName
        };
        this.props.signupUser(newUserData, this.props.history);
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    render() {
        const { classes, ui: { loading } } = this.props;
        const { errors } = this.state;

        return (
            <Grid container className={classes.page}>
                <Grid item style={{ width: '30%' }}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h3" style={{ paddingRight: '10px'}} >Events</Typography>
                        <img src={AppIcon} alt="party" className={classes.image} />
                    </Box>
                    <Typography>Welcome to our new app!
                        Here you can see and attend all
                        kind of events.
                        Moreover, you can share your own events!
                    </Typography>
                </Grid>                
                <Grid item className={classes.form}>
                    <Typography variant="h3" className={classes.pageTitle}>
                        Sign up
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit} className={classes.fields}>
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className={classes.textField} 
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            value={this.state.email}
                            onChange={this.handleChange} 
                            fullWidth 
                        />  
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className={classes.textField} 
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            value={this.state.password}
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            label="Confirm Password" 
                            className={classes.textField} 
                            helperText={errors.confirmPassword}
                            error={errors.confirmPassword ? true : false}
                            value={this.state.confirmPassword}
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="userName" 
                            name="userName" 
                            type="userName" 
                            label="User name" 
                            className={classes.textField} 
                            helperText={errors.userName}
                            error={errors.userName ? true : false}
                            value={this.state.userName}
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                { errors.general }
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            disabled={loading}
                        >
                            Sign up
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <small>Already have an account? Log in  <Link to ="/login"> here! </Link></small>
                    </form>
                </Grid>
            </Grid>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
  };

const mapStateToProps = (state) => ({
    user: state.user,
    ui: state.ui
})

const mapActionsToProps = {
    signupUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(signup));
