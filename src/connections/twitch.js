const logger = require('../util/logger');
const config = require('../configuration/configuration');
const TwitchJs = require('twitch-js');


const twitchConfig = config.getConnectionConfig().twitch;
class Twitch {

    constructor() {
        this.client = null;
    }

    connect() {
        this.client = new TwitchJs.Client({
            'channels': twitchConfig.channels,
            'connection': {
                'secure': true
            },
            'identity': {
                'password': twitchConfig.oauth,
                'username': twitchConfig.username
            },
            'options': {
                'clientId': twitchConfig.clientId
            }
        });

        this.client.connect()
            .then(() => {
                logger.toConsole('[connection.twitch] connected to twitch');
            })
            .catch(() => {
                logger.toConsole('[connection.twitch] connection to twitch not possible');
            });
    }

    sendAnnouncement(message) {
        twitchConfig.channels.forEach((channelName) => {
            logger.toConsole(`[connection.twitch] sending announcement to ${channelName}`);
            this.client.say(channelName, message);
        });
    }
}

module.exports = new Twitch();
