import * as moment from 'moment';

class Logger {
    public toConsole = (...args: any[]) => {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ...args); // eslint-disable-line no-console
    }
}

export default new Logger();
