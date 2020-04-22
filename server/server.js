const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
import { setDefaultMarkers, setCron } from '../src/firebase'
import { wakeUpDyno } from '../src/wakeDyno'

const app = express()

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/crontab', (req, res) => {
    setCron(req.body.markerID, new Date(req.body.date))
    res.send('ok')
});

app.get('/', (req, res) => {
    res.send('ok')
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
    wakeUpDyno('https://parkable-server.herokuapp.com/', 20);
    // setDefaultMarkers()
})


