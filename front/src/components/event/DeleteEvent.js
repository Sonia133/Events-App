import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import DeleteOutline from '@material-ui/icons/DeleteOutline';

import EditButton from '../../util/EditButton';
import { deleteEvent } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        left: '90%',
        position: 'absolute',
        top: '10%'
    }
}

class DeleteEvent extends Component {
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({ open: true })
    }
    handleClose = () => {
        this.setState({ open: false })
    }
    deleteEvent = () => {
        this.props.deleteEvent(this.props.eventId);
        this.setState({ open: false })
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <EditButton 
                    tip="Delete event" 
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color="secondary"></DeleteOutline>
                </EditButton>
                <Dialog 
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this event?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteEvent} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired
};

export default connect(null, { deleteEvent })(withStyles(styles)(DeleteEvent));
