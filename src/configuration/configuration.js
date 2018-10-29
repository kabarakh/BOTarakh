const configYaml = require('config-yaml');

let config = {};

const loadConfigurationIfNecessary = () => {
    if (Object.keys(config).length === 0) {
        config = configYaml('config/root.yaml');
    }
};

exports.getConnectionConfig = () => {
    loadConfigurationIfNecessary();

    return config.connections;
};

exports.getServiceConfig = () => {
    loadConfigurationIfNecessary();

    return config.services;
};
