import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Event from '../components/event/Event';

import { connect } from 'react-redux';

import { getEvents } from'../redux/actions/dataActions';
import { withStyles } from '@material-ui/core';

const styles = {

};

class home extends Component {
    componentDidMount() {
        this.props.getEvents();
    }
    render() {
        const { classes, data: { events, loading} } = this.props;

        let recentEventsMarkup = !loading ? (
          events.map(event => 
            <Grid item xs={3} key={event.eventId}>
              <Event event={event} />
            </Grid>)
        ) : (
            <p>Loading events..</p>
        );
        return (
          <Grid container spacing={10} style={{ padding: '50px 70px' }}>
              {recentEventsMarkup}
          </Grid> 
        )
    }
}

home.propTypes = {
    getEvents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    data: state.data 
})

export default connect(mapStateToProps, { getEvents })(withStyles(styles)(home));