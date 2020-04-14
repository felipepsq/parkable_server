const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var schedule = require('node-schedule')

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
    userDate.setMinutes(userDate.getMinutes() + 5)

    var rule = new schedule.RecurrenceRule();
    rule.date = userDate.getDate()
    rule.hour = userDate.getHours()
    rule.minute = userDate.getMinutes()
    // rule.second = userDate.getSeconds() + 2

    schedule.scheduleJob(rule, function () {
        firebase
            .database()
            .ref(`/markers/${markerID}`)
            .once('value', snapshot => {
                let data = snapshot.val()
                var date = new Date(data.properties.dateTime)

                var minus5 = new Date(data.properties.dateTime)
                minus5.setMinutes(minus5.getMinutes() - 2)

                var plus5 = new Date(data.properties.dateTime)
                plus5.setMinutes(plus5.getMinutes() + 2)

                console.log(minus5.getTime() > date.getTime() < plus5.getTime())

                if (minus5.getTime() > date.getTime() < plus5.getTime()) {
                    firebase
                        .database()
                        .ref(`/markers/${markerID}/properties/`)
                        .set({ inUse: false, dateTime: null, userUsing: null })
                }
            })
    });
}