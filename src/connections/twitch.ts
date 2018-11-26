import logger from '../util/logger';
import config, {TwitchConnectionConfig} from '../configuration/configuration';
import * as TwitchJs from 'twitch-js';
import ConnectionInterface from './connectionInterface';

class Twitch implements ConnectionInterface {
    protected twitchConfig: TwitchConnectionConfig;
    protected client: TwitchJs.Client;

    public constructor() {
        this.twitchConfig = config.getConnectionConfig().twitch;
        this.client = null;
    }

    public connect() {
        this.client = new TwitchJs.Client({
            'channels': this.twitchConfig.channels,
            'connection': {
                'secure': true
            },
            'identity': {
                'password': this.twitchConfig.oauth,
                'username': this.twitchConfig.username
            },
            'options': {
                'clientId': this.twitchConfig.clientId
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

    public sendAnnouncement({message, onlySendOnce}: {message: string, onlySendOnce: boolean}) {
        this.twitchConfig.channels.forEach((channelName: string) => {
            logger.toConsole(`[connection.twitch] sending announcement to ${channelName}`);
            this.client.say(channelName, message);
        });
    }
}

module.exports = new Twitch();
