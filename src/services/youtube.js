const config = require('../configuration/configuration');
const logger = require('../util/logger');
const EventEmitter = require('events');

class Youtube extends EventEmitter {
    recentUpdate () {
        logger.toConsole('drin wo ich erwarte');
        this.emit('announcement', 'test');
    }
}

module.exports = new Youtube();
