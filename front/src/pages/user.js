import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../redux/axios';
import { connect } from 'react-redux';

import Event from '../components/event/Event';
import StaticProfile from '../components/profile/StaticProfile';
import { getUserPage } from '../redux/actions/dataActions';

import Grid from '@material-ui/core/Grid';

class user extends Component {
    state = {
        profile: null
    };
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
    render() {
        const { events, loading } = this.props.data;

        const eventsMarkup = loading ? (
            <p>Loading events...</p>
        ) : events === null ? (
            <p>No events found for this user</p>
        ) : (
            events.map(event => 
                <Grid item xs={3}>
                    <Event key={event.eventId} event={event} />
                </Grid>
            )
        );

        return (
            <Grid container spacing={10}>
              <Grid item sm={4} xs={12}>
              {this.state.profile === null ? (
                    <p>Loading profile...</p>
                ) : (
                    <StaticProfile profile={this.state.profile} />
              )}
              </Grid>
              <Grid item sm={8} xs={12}>
                  <Grid container spacing={2}>
                    {eventsMarkup}
                  </Grid>
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