const moment = require('moment');

exports.toConsole = (...args) => {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ...args); // eslint-disable-line no-console
};
