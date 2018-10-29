const Discord = require('discord.js');
var cron = require('node-cron');
const client = new Discord.Client();
const axios = require('axios');
const configYaml = require('config-yaml');

const config = configYaml('config/root.yaml');

console.log(config.connections)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});



client.login(config.connections.discord.loginKey);

const getRecentYoutubeUpload = () => {
    let playlistId = 'someId'; // todo: get proper id by calling youtube api
    axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${config.services.youtube.apiKey}`)
    .then(response => {
        const channel = client.channels.find(ch => ch.name === config.connections.discord.announcementChannel);
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        // Send the message
        const youtubeData = response.data;
        const videoData = youtubeData.items[0].snippet;

        channel.send(`Schaut euch das aktuelle YouTube-Video auf dem Kanal "${videoData.channelTitle}" an: "${videoData.title}" - https://youtu.be/${videoData.resourceId.videoId}`);
    });
}

cron.schedule(config.services.youtube.announceRecentUpload.cronInterval, getRecentYoutubeUpload);

