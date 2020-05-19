const wakeDyno = require("woke-dyno");

export const wakeUpDyno = () => {
    wakeDyno({
        url: 'https://parkable-server.herokuapp.com/',
        interval: 900000,
        // startNap: [5, 0, 0, 0],
        // endNap: [9, 59, 59, 999]
    }).start()
}