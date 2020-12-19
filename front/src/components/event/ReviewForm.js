import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { submitReview } from '../../redux/actions/dataActions';

const styles = {
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      marginTop: 10,
      position: "relative",
      marginTop: 10
    }
};

class ReviewForm extends Component {
    state = {
        body: '',
        errors: {}
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ui.errors) {
          this.setState({ errors: nextProps.ui.errors });
        }
        if (!nextProps.ui.errors && !nextProps.ui.loading) {
          this.setState({ body: "", errors: {} });
        }
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit = event => {
        event.preventDefault();
        this.props.submitReview(this.props.eventId, { body: this.state.body });
    };
    render() {
        const { classes, authenticated, ui: { loading } } = this.props;
        const errors = this.state.errors;

        const reviewFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Review the event"
                        error={errors.review ? true : false}
                        helperText= {errors.review}
                        value={this.state.body}
                        onChange={this.handleChange}
                        className={classes.textField}
                        fullWidth
                    />
                    <Button 
                        variant="contained"
                        type="submit"
                        color="primary"
                        className={classes.button}
                        disabled={loading}
                    >
                        Review
                    </Button>
                </form>
            </Grid>
        ) : null;

        return reviewFormMarkup;
    }
}

ReviewForm.propTypes = {
    submitReview: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    eventId: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    ui: state.ui,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, { submitReview })(withStyles(styles)(ReviewForm));