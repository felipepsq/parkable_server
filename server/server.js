const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var schedule = require('node-schedule')
const wakeDyno = require("woke-dyno")

const firebaseConfig = {
    apiKey: "AIzaSyBGFolwQKLm8P9tycvYXZ5wJXx6k6VJKHk",
    authDomain: "parkable-41967.firebaseapp.com",
    databaseURL: "https://parkable-41967.firebaseio.com",
    projectId: "parkable-41967",
    storageBucket: "parkable-41967.appspot.com",
    messagingSenderId: "438106255214",
    appId: "1:438106255214:web:dfb35af6d7557650e35b7f",
    measurementId: "G-PBC777DPMQ"
};

var firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const app = express()

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/crontab', (req, res) => {
    setCron(req.body.markerID, new Date(req.body.date))
    res.send('ok')
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
    wakeDyno({
        url: 'https://git.heroku.com/parkable-server.git',
        // interval: 60000, // interval in milliseconds (1 minute in this example)
        // startNap: [5, 0, 0, 0], // the time to start nap in UTC, as [h, m, s, ms] (05:00 UTC in this example)
        // endNap: [9, 59, 59, 999] // time to wake up again, in UTC (09:59:59.999 in this example)
    }).start();
    // setDefaultMarkers()
})

const setDefaultMarkers = () => {
    firebase
        .database()
        .ref(`/markers`)
        .once('value', snapshot => {
            let data = snapshot.val()
            if (data) {
                const keys = Object.keys(data)
                keys.map(id => {
                    firebase
                        .database()
                        .ref(`/markers/${id}/properties/`)
                        .set({ inUse: false, dateTime: null, userUsing: null })
                })
                console.log('Markers liberados!')
            }
            else {
                return
            }
        })
}

const setCron = (markerID, userDate) => {
    userDate.setHours(userDate.getHours() + 2)

    var rule = new schedule.RecurrenceRule();
    rule.date = userDate.getDate()
    rule.hour = userDate.getHours()
    rule.minute = userDate.getMinutes()

    schedule.scheduleJob(rule, function () {
        firebase
            .database()
            .ref(`/markers/${markerID}`)
            .once('value', snapshot => {
                let data = snapshot.val()
                if (data.properties.dateTime) {
                    var date = new Date(data.properties.dateTime)

                    var minus2 = new Date(data.properties.dateTime)
                    minus2.setMinutes(minus2.getMinutes() - 2)

                    var plus2 = new Date(data.properties.dateTime)
                    plus2.setMinutes(plus2.getMinutes() + 2)

                    if (minus2.getTime() > date.getTime() < plus2.getTime()) {
                        firebase
                            .database()
                            .ref(`/markers/${markerID}/properties/`)
                            .set({ inUse: false, dateTime: null, userUsing: null })
                    }
                }
                return
            })
    });
}