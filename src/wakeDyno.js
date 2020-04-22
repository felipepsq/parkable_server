const wakeDyno = require("woke-dyno");

export const wakeUpDyno = () => {
    wakeDyno({
        url: 'https://parkable-server.herokuapp.com/',  // url string
        interval: 900000, // interval in milliseconds
        // startNap: [5, 0, 0, 0], // the time to start nap in UTC, as [h, m, s, ms] (05:00 UTC in this example)
        // endNap: [9, 59, 59, 999] // time to wake up again, in UTC (09:59:59.999 in this example)
    }).start()
}