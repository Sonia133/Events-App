import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../redux/axios';
import { connect } from 'react-redux';

import Event from '../components/event/Event';
import StaticProfile from '../components/profile/StaticProfile';
import { getUserPage } from '../redux/actions/dataActions';
import EventSkeleton from '../util/EventSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import Grid from '@material-ui/core/Grid';

class user extends Component {
    state = {
        profile: null,
        eventIdParam: null
    };
    componentDidMount() {
        const userName = this.props.match.params.userName;
        const eventId = this.props.match.params.eventId;
    
        if (eventId) this.setState({ eventIdParam: eventId });
        
        this.props.getUserPage(userName);
        axios
          .get(`/user/${userName}`)
          .then(res => {
            this.setState({ profile: res.data.user });
          })
          .catch(err => console.log(err));

    }
    render() {
        const { events, loading } = this.props.data;
        const { eventIdParam } = this.state;

        const eventsMarkup = loading ? (
            <EventSkeleton />
        ) : events === null ? (
            <p>No events found for this user</p>
        ) : !eventIdParam ? (
            events.map(event => <Event key={event.eventId} event={event} />)
        ) : (
            events.map(event => {
              if (event.eventId !== eventIdParam)
                return <Event key={event.eventId} event={event} />;
              else return <Event key={event.eventId} event={event} openDialog />;
            })
        );
        return (
            <Grid container spacing={10}>
              <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <ProfileSkeleton />
                ) : (
                    <StaticProfile profile={this.state.profile} />
                )}
              </Grid>
              <Grid item sm={8} xs={12}>
                  {eventsMarkup}
              </Grid>
          </Grid> 
        )
    }
}


user.propTypes = {
    getUserPage: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, { getUserPage })(user);