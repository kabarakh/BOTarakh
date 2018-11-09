const logger = require('../util/logger');
const config = require('../configuration/configuration');
const DiscordJs = require('discord.js');

const client = new DiscordJs.Client();
const discordConfig = config.getConnectionConfig().discord;
class Discord {
    connect() {
        client.on('ready', () => {
            logger.toConsole(`[connection.discord] logged in as ${client.user.tag}`);
        });
        client.login(discordConfig.loginKey);
    }

    sendAnnouncement(message) {
        if (client.user) {
            discordConfig.announcementChannels.forEach((channelName) => {
                const channel = client.channels.find((ch) => ch.name === channelName);
                // Do nothing if the channel wasn't found on this server
                if (!channel) {
                    logger.toConsole(`[connection.discord] tried to announce message to channel ${channelName}, but channel was not found.`);
                    return;
                }
                // Get the last message by the bot from the announcement channel
                channel.fetchMessages()
                    .then((messages) => messages.filter((foundMessage) => foundMessage.author.id === client.user.id))
                    .then((filteredMessages) => filteredMessages.filter((foundMessage) => foundMessage.content === message))
                    .then((formerAnnouncements) => {
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
