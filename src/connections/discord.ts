import logger from '../util/logger';
import config, { DiscordConnectionConfig } from '../configuration/configuration';
import * as DiscordJs from 'discord.js';
import ConnectionInterface from './connectionInterface'

class Discord implements ConnectionInterface {
    protected client: DiscordJs.Client;
    protected discordConfig: DiscordConnectionConfig;

    public constructor() {
        this.client = new DiscordJs.Client();
        this.discordConfig = config.getConnectionConfig().discord;
    }

    public connect() {
        this.client.on('ready', () => {
            logger.toConsole(`[connection.discord] logged in as ${this.client.user.tag}`);
        });
        this.client.login(this.discordConfig.loginKey);
    }

    public sendAnnouncement(message: string) {
        if (this.client.user) {
            this.discordConfig.announcementChannels.forEach((channelName: string) => {
                const channel = (this.client.channels.find((ch: DiscordJs.TextChannel) => ch.name === channelName) as DiscordJs.TextChannel);
                // Do nothing if the channel wasn't found on this server
                if (!channel) {
                    logger.toConsole(`[connection.discord] tried to announce message to channel ${channelName}, but channel was not found.`);
                    return;
                }
                // Get the last message by the bot from the announcement channel
                channel.fetchMessages()
                    .then((messages: DiscordJs.Collection<DiscordJs.Snowflake, DiscordJs.Message>) => messages.filter((foundMessage) => foundMessage.author.id === this.client.user.id))
                    .then((filteredMessages: DiscordJs.Collection<DiscordJs.Snowflake, DiscordJs.Message>) => filteredMessages.filter((foundMessage) => foundMessage.content === message))
                    .then((formerAnnouncements: DiscordJs.Collection<DiscordJs.Snowflake, DiscordJs.Message>) => {
                        const formerAnnouncementsArray = formerAnnouncements.array();
                        if (formerAnnouncementsArray.length > 0) {
                            logger.toConsole(`[connection.discord] not sending announcement to channel ${channelName} because that message was sent already`);
                        } else {
                            logger.toConsole(`[connection.discord] sending announcement to channel ${channelName}`);
                            channel.send(message);
                        }
                    });
            });
        }
    }
}

module.exports = new Discord();
