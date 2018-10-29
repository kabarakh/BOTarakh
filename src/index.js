const foreach = require('lodash.foreach');
const config = require('./configuration/configuration');

foreach(config.getConnectionConfig(), (connectionConfig, connectionName) => {
    // By requiring the file we need here, we do not have to build our own dep tree
    const connection = require(`./connections/${connectionName}`); // eslint-disable-line global-require
    connection.connect();
});
