import {forEach} from 'lodash';
import config from './configuration/configuration';
import logger from './util/logger';
import * as cron from 'node-cron';
import ConnectionInterface from './connections/connectionInterface';

const activeConnections: {[key: string]: ConnectionInterface} = {};

const sendAnnouncement = (announcement: {message: string, onlySendOnce: boolean}) => {
    forEach(activeConnections, (connection: ConnectionInterface) => connection.sendAnnouncement(announcement));
};

forEach(config.getConnectionConfig(), (connectionConfig, connectionName) => {
    // By requiring the file we need here, we do not have to build our own dep tree
    const connection: ConnectionInterface = require(`./connections/${connectionName}`); // eslint-disable-line global-require
    if (!connection.connect || typeof connection.connect !== 'function') {
        logger.toConsole(`Connection ${connectionName} has no method 'connect'`);
    } else {
        connection.connect();
        activeConnections[connectionName] = connection;
    }
});

forEach(config.getServiceConfig(), (serviceConfig, serviceName) => {
    const service = require(`./services/${serviceName}`); // eslint-disable-line global-require
    service.on('announcement', sendAnnouncement);

    forEach(serviceConfig.announcements, (announcementConfig, announcementMethodName) => {
        const announcementMethod = service[announcementMethodName];
        cron.schedule(announcementConfig.cronInterval, () => {
            announcementMethod.call(service);
        });
    });
});
