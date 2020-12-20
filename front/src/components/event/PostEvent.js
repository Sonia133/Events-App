import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import config from '../../util/firebaseConfig';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import EditButton from '../../util/EditButton';
import { postEvent, clearErrors } from '../../redux/actions/dataActions';

const styles = {
    textField: {
      marginBottom: "10px"
    },
    submitButton: {
      position: "relative",
      float: "right"
    },
    progress: {
      position: "absolute"
    },
    closeButton: {
      position: "absolute",
      left: "90%",
      top: "6%"
    }
};

class PostEvent extends Component {
    state = {
        open: false,
        title: "",
        info: "",
        specialGuest: "",
        specialGuestInfo: "",
        location: "",
        errors: {}
    };
    handleOpen = () => {
        this.setState({ open: true })
    }
    handleClose = () => {
        this.props.clearErrors(); 
        this.setState({ open: false, errors: {} })
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit = event => {
        console.log(this.state)
        event.preventDefault();
        this.props.postEvent({ 
            title: this.state.title,
            info: this.state.info,
            specialGuest: this.state.specialGuest,
            specialGuestInfo: this.state.specialGuestInfo,
            location: this.state.location 
        });
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.ui.errors) {
            this.setState({ errors: nextProps.ui.errors });
        }
        if (!nextProps.ui.errors && !nextProps.ui.loading) {
            this.setState({ 
                title: "", 
                info: "",
                specialGuest: "",
                specialGuestInfo: "",
                location: "",
                open: false, 
                errors: {} 
            });
        }
    }
    render() {
        const { classes, ui: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Fragment>
                <EditButton onClick={this.handleOpen} tip="Post an event">
                    <AddIcon></AddIcon>
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
                    <DialogTitle>Post a new event</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField 
                                name="title" 
                                type="text" 
                                label="Event title"
                                multiline
                                rows="3"
                                placeholder="Title"
                                error={errors.title ? true : false}
                                helperText={errors.title}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField 
                                name="info" 
                                type="text" 
                                label="Event info"
                                multiline
                                rows="3"
                                placeholder="Describe the event"
                                error={errors.info ? true : false}
                                helperText={errors.info}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField 
                                name="specialGuest" 
                                type="text" 
                                label="Special guest"
                                multiline
                                rows="3"
                                placeholder="Special guest"
                                error={errors.specialGuest ? true : false}
                                helperText={errors.specialGuest}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField 
                                name="specialGuestInfo" 
                                type="text" 
                                label="Special guest info"
                                multiline
                                rows="3"
                                placeholder="Special guest info"
                                error={errors.specialGuestInfo ? true : false}
                                helperText={errors.specialGuestInfo}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField 
                                name="location" 
                                type="text" 
                                label="Event location"
                                multiline
                                rows="3"
                                placeholder="Location of the event"
                                error={errors.location ? true : false}
                                helperText={errors.location}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                Post
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressSpinner} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostEvent.propTypes = {
    postEvent: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    ui: state.ui
});

const mapActionToProps = {
    postEvent,
    clearErrors
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(PostEvent));