const foreach = require('lodash.foreach');
const config = require('./configuration/configuration');
const logger = require('./util/logger');
const cron = require('node-cron');

const activeConnections = {};

const sendAnnouncement = (message) => {
    logger.toConsole('sending announcement');
    foreach(activeConnections, (connection) => connection.sendAnnouncement(message));
};

foreach(config.getConnectionConfig(), (connectionConfig, connectionName) => {
    // By requiring the file we need here, we do not have to build our own dep tree
    const connection = require(`./connections/${connectionName}`); // eslint-disable-line global-require
    if (!connection.connect || typeof connection.connect !== 'function') {
        logger.toConsole(`Connection ${connectionName} has no method 'connect'`);
    } else {
        connection.connect();
        activeConnections[connectionName] = connection;
    }
});

foreach(config.getServiceConfig(), (serviceConfig, serviceName) => {
    const service = require(`./services/${serviceName}`); // eslint-disable-line global-require
    service.on('announcement', sendAnnouncement);

    foreach(serviceConfig.announcements, (announcementConfig, announcementMethodName) => {
        const announcementMethod = service[announcementMethodName];

        cron.schedule(announcementConfig.cronInterval, () => {
            announcementMethod.call(service);
        });
    });
});
