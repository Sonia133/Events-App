const functions = require('firebase-functions');
const app = require('express')();

var cors = require('cors');
app.use(cors());

const { uploadImageEvent, getAllEvents, postOneEvent, getEvent, reviewEvent, attendEvent, unattendEvent, deleteEvent } = require('./handlers/events');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');

const FBAuth = require('./util/fbAuth');


// event routes
app.post('/event', FBAuth, postOneEvent);
app.get('/events', getAllEvents);
app.get('/event/:eventId', getEvent);
app.delete('/event/:eventId', FBAuth, deleteEvent);
app.get('/event/:eventId/attend', FBAuth, attendEvent);
app.get('/event/:eventId/unattend', FBAuth, unattendEvent);
app.post('/event/:eventId/review', FBAuth, reviewEvent);
app.post('/event/:eventId/image', FBAuth, uploadImageEvent);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:userName', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

// exports.deleteNotificationOnUnlike = functions.region('europe-west1').firestore.document('likes/{id}')
//     .onDelete((snapshot) => {
//         return db.doc(`/notifications/${snapshot.id}`)
//         .delete()
//         .catch(err => {
//             console.error(err);
//             return;
//         })
//     })

// exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
//     .onCreate((snapshot) => {
//         return db.doc(`/screams/${snapshot.data().screamId}`)
//         .get()
//         .then(doc => {
//             if (doc.exists) {
//                 return db.doc(`/notifications/${snapshot.id}`).set({
//                     createdAt: new Date().toISOString(),
//                     recipient: doc.data().userHandle,
//                     sender: snapshot.data().userHandle,
//                     type: 'like',
//                     read: false,
//                     screamId: doc.id
//                 })
//             }
//         })
//         .catch(err => console.error(err));
//     })

// exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
//     .onCreate((snapshot) => {
//         return db.doc(`/screams/${snapshot.data().screamId}`)
//         .get()
//         .then(doc => {
//             if (doc.exists) {
//                 return db.doc(`/notifications/${snapshot.id}`).set({
//                     createdAt: new Date().toISOString(),
//                     recipient: doc.data().userHandle,
//                     sender: snapshot.data().userHandle,
//                     type: 'comment',
//                     read: false,
//                     screamId: doc.id
//                 })
//             }
//         })
//         .catch(err => console.error(err));
//     })

// exports.onUserImageChange = functions.region('europe-west1').firestore.document('users/{userId}')
//     .onUpdate((change) => {
//         console.log(change.before.data)
//         console.log(change.after.data)
//         if (change.before.data().imageUrl !== change.after.data(),imageUrl) {
//             const batch = db.batch();
//             return db.collection('screams').where('userHandle', '==', change.before.data().handle)
//                 .get()
//                 .then(data => {
//                     data.forEach(doc => {
//                         const scream = db.doc(`/screams/${doc.id}`);

//                         batch.update(scream, { userImage: change.after.data().imageUrl });
//                     })

//                     return batch.commit();
//                 })
//         } else return true;
//     })

// exports.onScreamDelete = functions.region('europe-west1').firestore.document('screams/{screamId}')
//     .onDelete((snapshot, context) => {
//         const screamId = context.params.screamId;
//         const batch = db.batch();

//         return db.collection('comments').where('screamId', '==', screamId)
//             .get()
//             .then(data => {
//                 data.forEach(doc => {
//                     batch.delete(db.doc(`/comments/${doc.id}`));
//                 })

//                 return db.collection('likes').where('screamId', '==', screamId);
//             })
//             .then(data => {
//                 data.forEach(doc => {
//                     batch.delete(db.doc(`/likes/${doc.id}`));
//                 })

//                 return db.collection('notifications').where('screamId', '==', screamId);
//             })
//             .then(data => {
//                 data.forEach(doc => {
//                     batch.delete(db.doc(`/notifications/${doc.id}`));
//                 })

//                 return batch.commit();
//             })
//             .catch(err => console.error(err));
//     })