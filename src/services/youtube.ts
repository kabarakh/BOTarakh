import config, {YoutubeServiceConfig} from '../configuration/configuration';
import {EventEmitter} from 'events';
import axios from 'axios';

const youtubeConfig = config.getServiceConfig().youtube;

class Youtube extends EventEmitter {

    public constructor() {
        super();
    }

    public recentUpload() {
        axios.get(`https://www.googleapis.com/youtube/v3/channels?forUsername=${youtubeConfig.username}&key=${youtubeConfig.apiKey}&part=id`)
            .then((response) => response.data.items[0].id)
            .then((channelId: string) => axios.get(`https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&maxResults=1&channelId=${channelId}&key=${youtubeConfig.apiKey}`))
            .then((response) => {
                // Send the message
                const youtubeData = response.data;
                const videoData = youtubeData.items[0];

                this.emit('announcement', {
                    message: `Schaut euch das aktuelle YouTube-Video auf dem Kanal "${videoData.snippet.channelTitle}" an: "${videoData.snippet.title}" - https://youtu.be/${videoData.id.videoId}`,
                    onlySendOnce: true
                });
            });
    }
}

module.exports = new Youtube();
