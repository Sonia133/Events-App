const { db, admin } = require('../util/admin');
const config = require('../util/config');


exports.getAllEvents = (req, res) => {
    db
    .collection('events')
    .orderBy('date', 'desc')
    .get()
    .then(data => {
        let events = [];
        data.forEach(document => {
            events.push({
                ...document.data(),
                eventId: document.id
            }); 
        });
        return res.json(events);
    })
    .catch(err => console.error(err));
};

exports.postOneEvent = (req, res) => {
    if (req.body.title.trim() === '') {
        return res.status(400).json({ title: 'Title must not be empty' });
    }

    if (req.body.info.trim() === '') {
        return res.status(400).json({ info: 'Info must not be empty' });
    }

    if (req.body.specialGuest.trim() === '') {
        return res.status(400).json({ specialGuest: 'Evnt must have a special guest' });
    }

    if (req.body.specialGuestInfo.trim() === '') {
        return res.status(400).json({ specialGuestInfo: 'The special guest must be described' });
    }

    if (req.body.location.trim() === '') {
        return res.status(400).json({ location: 'Location must not be empty' });
    }

    const newEvent = {
        title: req.body.title,
        info: req.body.info,
        specialGuest: req.body.specialGuest,
        specialGuestInfo: req.body.specialGuestInfo,
        location: req.body.location,
        organizer: req.user.userName,
        eventImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        date: new Date().toISOString(),
        participantCount: 0,
        reviewCount: 0
    };

    db
    .collection('events')
    .add(newEvent)
    .then(doc => {
        newEvent.eventId = doc.id;
        res.json(newEvent);
    })
    .catch(err => {
        res.status(500).json({ error: "Error adding new event" });
        console.error(err);
    });
};

exports.getEvent = (req, res) => {
    let eventData = {};

    db.doc(`/events/${req.params.eventId}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found!'} );
        }

        eventData = doc.data();
        eventData.eventId = doc.id;

        return db.collection('reviews').where('eventId', '==', req.params.eventId)
        .get();
    })
    .then((docs) => {
        eventData.reviews = [];
        docs.forEach((doc) => {
            eventData.reviews.push(doc.data());
        });

        return db.collection('participants').where('eventId', '==', req.params.eventId)
        .get();
    })
    .then((docs) => {
        eventData.participants = [];
        docs.forEach((doc) => {
            eventData.participants.push(doc.data());
        });

        return res.json(eventData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    })
};

exports.reviewEvent = (req, res) => {
    if (req.body.body.trim() === '') 
        return res.status(400).json({ review: "must not be empty" });

    const newReview = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        eventId: req.params.eventId,
        reviewer: req.user.userName,
        userImage: req.user.imageUrl
    };

    let eventData;

    db.doc(`/events/${req.params.eventId}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ review: 'Event not found!'} );
        }

        eventData = doc.data();
        eventData.eventId = doc.id;
        
        return doc.ref.update({ reviewCount: doc.data().reviewCount + 1});
    })
    .then(() => {
        return db.collection('reviews').add(newReview);
    })
    .then(doc => {
        if(eventData.organizer !== req.user.userName) {
            return db.doc(`/notifications/${doc.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: eventData.organizer,
                sender: req.user.userName,
                read: false,
                eventId: eventData.eventId,
                type: 'review'
            })
        }
    })
    .then(() => {
        res.json(newReview);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    })
};

exports.attendEvent = (req, res) => {
    const attendDocument = db.collection('participants').where('userName', '==', req.user.userName)
        .where('eventId', '==', req.params.eventId);
    
    const eventDocument = db.doc(`events/${req.params.eventId}`);

    let eventData;
    eventDocument.get()
        .then(doc => {
            console.log(doc.data())
            if(doc.exists) {
                eventData = doc.data();
                eventData.eventId = doc.id;

                return attendDocument.get();
            } else {
                return res.status(404).json( { error: 'Event not found.' });
            }
        })
        .then(data => {
            if (data.empty) {
                db.collection('participants').add({
                    userName: req.user.userName,
                    eventId: eventData.eventId
                })
                .then(doc => {
                    if(eventData.organizer !== req.user.userName) {
                        return db.doc(`/notifications/${doc.id}`).set({
                            createdAt: new Date().toISOString(),
                            recipient: eventData.organizer,
                            sender: req.user.userName,
                            read: false,
                            type: 'attend',
                            eventId: eventData.eventId
                        })
                    }
                })
                .then(() => {
                    eventData.participantCount ++;
                    return eventDocument.update({ participantCount: eventData.participantCount });
                })
                .then(() => {
                    return res.json(eventData);
                });
            } else {
                return res.status(400).json({ error: 'Event already attended.'});
            }
        })
        .catch(error => {
            console.log("error attending event", error);
            res.status(500).json({ error });
        });     
}

exports.unattendEvent = (req, res) => {
    const attendDocument = db.collection('participants').where('userName', '==', req.user.userName)
        .where('eventId', '==', req.params.eventId)
        .limit(1);

    const eventDocument = db.doc(`events/${req.params.eventId}`);

    let eventData;

    eventDocument.get()
        .then(doc => {
            if(doc.exists) {
                eventData = doc.data();
                eventData.eventId = doc.id;

                return attendDocument.get();
            } else {
                return res.status(404).json( { error: 'Event not found.' });
            }
        })
        .then(data => {
            if (data.empty) {
                return res.status(400).json({ error: 'Event not attended.'});
            } else {
                return db.doc(`/participants/${data.docs[0].id}`).delete()
                    .then(() => {
                        eventData.participantCount--;
                        return eventDocument.update({ participantCount: eventData.participantCount });
                    })
                    .then(doc => {
                        if(eventData.organizer !== req.user.userName) {
                            return db.doc(`/notifications/${doc.id}`).set({
                                createdAt: new Date().toISOString(),
                                recipient: eventData.organizer,
                                sender: req.user.userName,
                                read: false,
                                type: 'unattend',
                                eventId: eventData.eventId
                            })
                        }
                    })
                    .then(() => {
                        res.json(eventData);
                    })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        });
}

exports.deleteEvent = (req, res) => {
    const document = db.doc(`/events/${req.params.eventId}`);

    document.get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Event not found.' });
            }

            if(doc.data().organizer !== req.user.userName) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            const eventId = req.params.eventId;
            const batch = db.batch();
    
            return db.collection('reviews').where('eventId', '==', eventId)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        batch.delete(db.doc(`/reviews/${doc.id}`));
                    })
    
                    return db.collection('participants').where('eventId', '==', eventId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        batch.delete(db.doc(`/participants/${doc.id}`));
                    })
    
                    return db.collection('notifications').where('eventId', '==', eventId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        batch.delete(db.doc(`/notifications/${doc.id}`));
                    })
    
                    return batch.commit();
                })
        })
        .then(() => {
            res.json({ message: 'Event deleted successfully!' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}

exports.uploadImageEvent = (req, res) => {
    console.log('event')
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
            const eventImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            
            return db.doc(`/events/${req.params.eventId}`).update({ eventImage });
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
