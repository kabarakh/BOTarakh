import * as configYaml from 'config-yaml';

export interface YoutubeServiceConfig {
    apiKey: string,
    username: string,
    announcements: {
        recentUpload: {
            cronInterval: string
        }
    }
}

export interface DiscordConnectionConfig {
    loginKey: string,
    announcementChannels: string[]
}

export interface TwitchConnectionConfig {
    oauth: string,
    username: string,
    clientId: string,
    channels: string[]
}

export interface ConfigObject {
    services?: {
        youtube: YoutubeServiceConfig
    },
    connections?: {
        twitch: TwitchConnectionConfig,
        discord: DiscordConnectionConfig
    }
}

class Configuration {

    protected config: ConfigObject = {};

    protected loadConfigurationIfNecessary = () => {
        if (Object.keys(this.config).length === 0) {
            this.config = configYaml('config/root.yaml');
        }
    }

    public getConnectionConfig = () => {
        this.loadConfigurationIfNecessary();

        return this.config.connections;
    }

    public getServiceConfig = () => {
        this.loadConfigurationIfNecessary();

        return this.config.services;
    }
}

export default new Configuration();
