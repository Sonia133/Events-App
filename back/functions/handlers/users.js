const { admin, db } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userName: req.body.userName,
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;

    db.doc(`/users/${newUser.userName}`).get()
        .then(doc => {
            if(doc.exists) {
                return res.status(400).json({ userName: 'This user name is already taken.' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                userName: newUser.userName,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };

            return db.doc(`/users/${newUser.userName}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({email: 'Email already is in use.'});
            } else {
                return res.status(500).json({general: 'Something went wrong. Please try again! '});
            }
        });
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/user-not-found") {
                return res.status(403).json({ general: 'This email does not exist.'})
            }
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({ general: 'Wrong password.'})
            }
            return res.status(500).json({ error: err.code })
        });
};

exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.userName}`)
    .update(userDetails)
    .then(() => {
        return res.json({ message: 'Details added successfully!'})
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code })
    })
}

exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.userName}`)
    .get()
    .then(doc => {
        if(doc.exists) {
            userData.user = doc.data();
            return db.collection('events').where('organizer', '==', req.params.userName)
                .orderBy('date', 'desc')
                .get();
        } else {
            return res.status(404).json({ error: 'User not found.' });
        }
    })
    .then(data => {
        userData.events = [];
        data.forEach(event => {
            userData.events.push({
                title: event.data().title,
                date: event.data().date,
                organizer: req.params.userName,
                userImage: event.data().userImage,
                participantCount: event.data().participantCount,
                reviewCount: event.data().reviewCount,
                eventId: event.id
            })
        })

        return res.json(userData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`users/${req.user.userName}`)
    .get()
    .then(doc => {
        if (doc.exists) {
            userData.credentials = doc.data();
            db.collection('participants').where('userName', '==', req.user.userName)
            .get()
            .then(data => {
                userData.upcomingEvents = [];
                data.forEach(doc => {
                    userData.upcomingEvents.push(doc.data());
                })

                return db.collection('notifications').where('recipient', '==', req.user.userName)
                    .orderBy('createdAt', 'desc').limit(10)
                    .get()
                    .then(data => {
                        userData.notifications = [];
                        data.forEach(doc => {
                            userData.notifications.push({
                                recipient: doc.data().recipient,
                                sender: doc.data().sender,
                                createdAt: doc.data().createdAt,
                                eventId: doc.data().eventId,
                                read: doc.data().read,
                                notificationId: doc.id,
                                type: doc.data().type
                            })
                        })

                        return res.json(userData);
                    })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err.code })
            })
        }
    })
}

exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageTeBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
        if (mimetype !== 'image/type' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted. '});
        }
        
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000)}.${imageExtension}`;

        const filepath = path.join(os.tmpdir(), imageFileName);
        imageTeBeUploaded = {
            filepath,
            mimetype
        };

        file.pipe(fs.createWriteStream(filepath));
    })

    let imageUrl;

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageTeBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageTeBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.userName}`).update({ imageUrl });
        })
        .then(() => {
            const batch = db.batch();
            return db.collection('events').where('organizer', '==', req.user.userName)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        const event = db.doc(`/events/${doc.id}`);

                        batch.update(event, { userImage: imageUrl });
                    })

                    return db.collection('reviews').where('reviewer', '==', req.user.userName).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const review = db.doc(`/reviews/${doc.id}`);

                        batch.update(review, { userImage: imageUrl });
                    })
    
                    return batch.commit();
                })
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully!' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
    });
    busboy.end(req.rawBody);
}; 

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();

    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });

    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked read' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}