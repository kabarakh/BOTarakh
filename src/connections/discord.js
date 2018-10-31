const logger = require('../util/logger');
const config = require('../configuration/configuration');
const DiscordJs = require('discord.js');

const client = new DiscordJs.Client();
const discordConfig = config.getConnectionConfig().discord;
class Discord {
    connect () {
        client.on('ready', () => {
            logger.toConsole(`Logged in as ${client.user.tag} to discord!`);
        });

        client.login(discordConfig.loginKey);
    }


    sendAnnouncement (message) {
        if (client.user) {
            const channel = client.channels.find((ch) => ch.name === discordConfig.announcementChannel);
            // Do nothing if the channel wasn't found on this server
            if (!channel) {
                logger.toConsole(`tried to announce message to channel ${discordConfig.announcementChannel}, but channel was not found.`);
                return;
            }
            // Get the last message by the bot from the announcement channel
            channel.fetchMessages()
                .then((messages) => messages.filter((foundMessage) => foundMessage.author.id === client.user.id))
                .then((filteredMessages) => filteredMessages.first())
                .then((recentBotAnnouncement) => {
                    if (recentBotAnnouncement.content === message) {
                        logger.toConsole('not sending announcement because last message is the same');
                    } else {
                        channel.send(message);
                    }
                });
        }
    }
}

module.exports = new Discord();
