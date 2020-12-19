import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

import EditButton from '../../util/EditButton';

import { attendEvent, unattendEvent } from '../../redux/actions/dataActions';

class AttendButton extends Component {
    attendedEvent = () => {
        if (this.props.user.upcomingEvents && this.props.user.upcomingEvents.find(upcomingEvent => upcomingEvent.eventId === this.props.eventId)) {
            return true;
        } else return false;
    }
    attendEvent = () => {
        this.props.attendEvent(this.props.eventId);
    }
    unattendEvent = () => {
        this.props.unattendEvent(this.props.eventId);
    }
    render() {
        dayjs.extend(relativeTime);
        const { authenticated } = this.props.user;

        const attendButton = !authenticated ? (
            <Link to='/login'>
                <EditButton tip="attend">
                        <LibraryAddIcon color="primary"></LibraryAddIcon>
                </EditButton>
            </Link>
        ) : (
            this.attendedEvent() ? (
                <EditButton tip="unattend" onClick={this.unattendEvent}>
                    <LibraryAddCheckIcon color="primary"></LibraryAddCheckIcon>
                </EditButton>
            ) : (
                <EditButton tip="attend" onClick={this.attendEvent}>
                    <LibraryAddIcon color="primary"></LibraryAddIcon>
                </EditButton>
            )
        )
        return attendButton;
    }
}

AttendButton.propTypes = {
    attendEvent: PropTypes.func.isRequired,
    unattendEvent: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = {
    attendEvent,
    unattendEvent
}

export default connect(mapStateToProps, mapActionToProps)(AttendButton);