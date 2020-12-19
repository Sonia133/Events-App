import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
    invisibleSeparator: {
      border: "none",
      margin: 4,
      marginLeft: 10
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    reviewImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    reviewData: {
        marginLeft: 20
    }
};

class Reviews extends Component {
    render() {
        const { reviews, classes } = this.props;
        return (
            <Grid container>
                {reviews.map((review, index) => {
                    const { body, createdAt, userImage, reviewer } = review;
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <img src={userImage} alt="review" className={classes.reviewImage}></img>
                                    </Grid>
                                    <hr className={classes.invisibleSeparator} />
                                    <Grid item sm={9}>
                                        <div className={classes.reviewData}>
                                            <Typography 
                                                variant="h5"
                                                component={Link}
                                                to={`users/${reviewer}`}
                                                color="primary"
                                            >
                                                {reviewer}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={classes.invisibleSeparator} />
                                            <Typography variant="body1">
                                                {body}
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== reviews.length - 1 && (
                                <hr className={classes.visibleSeparator} />
                            )}
                        </Fragment> 
                    )
                })}
            </Grid>
        )
    }
}

Reviews.propTypes = {
    reviews: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Reviews);
