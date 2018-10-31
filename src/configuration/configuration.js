const configYaml = require('config-yaml');

let config = {};

const loadConfigurationIfNecessary = Symbol('loadConfigurationIfNecessary');

class Configuration {

    [loadConfigurationIfNecessary] () {
        if (Object.keys(config).length === 0) {
            config = configYaml('config/root.yaml');
        }
    }

    getConnectionConfig () {
        this[loadConfigurationIfNecessary]();

        return config.connections;
    }

    getServiceConfig () {
        this[loadConfigurationIfNecessary]();

        return config.services;
    }
}

module.exports = new Configuration();
