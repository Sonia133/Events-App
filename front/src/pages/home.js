import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Event from '../components/event/Event';
import Profile from '../components/profile/Profile';
import EventSkeleton from '../util/EventSkeleton';

import { connect } from 'react-redux';

import { getEvents } from'../redux/actions/dataActions';

class home extends Component {
    componentDidMount() {
        this.props.getEvents();
    }
    render() {
        const { events, loading } = this.props.data;

        let recentEventsMarkup = !loading ? (
          events.map(event => 
          <Event key={event.eventId} event={event} />)
        ) : (
            <EventSkeleton />
        );
        return (
          <Grid container spacing={10}>
              <Grid item sm={4} xs={12}>
                <Profile />
              </Grid>
              <Grid item sm={8} xs={12}>
                  {recentEventsMarkup}
              </Grid>
          </Grid> 
        )
    }
}

home.propTypes = {
    getEvents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    data: state.data 
})

export default connect(mapStateToProps, { getEvents })(home);