import config, {YoutubeServiceConfig} from '../configuration/configuration';
import {EventEmitter} from 'events';
import axios from 'axios';

const youtubeConfig = config.getServiceConfig().youtube;

class Youtube extends EventEmitter {

    public constructor() {
        super();
    }

    public recentUpload() {
        axios.get(`https://www.googleapis.com/youtube/v3/channels?forUsername=${youtubeConfig.username}&key=${youtubeConfig.apiKey}&part=contentDetails`)
            .then((response) => response.data.items[0].contentDetails.relatedPlaylists.uploads)
            .then((playlistId: string) => axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${youtubeConfig.apiKey}`))
            .then((response) => {
                // Send the message
                const youtubeData = response.data;
                const videoData = youtubeData.items[0].snippet;

                this.emit('announcement', `Schaut euch das aktuelle YouTube-Video auf dem Kanal "${videoData.channelTitle}" an: "${videoData.title}" - https://youtu.be/${videoData.resourceId.videoId}`);
            });
    }
}

module.exports = new Youtube();