import chalk from 'chalk';
import * as constant from '../constants.js'; 

function getStatusColor(statusCode) {
    if (statusCode >= 200 && statusCode < 300) {
      return chalk.green;
    }
    if (statusCode >= 300 && statusCode < 400) {
      return chalk.blue;
    }
    if (statusCode >= 400 && statusCode < 500) {
      return chalk.yellow;
    }
    if (statusCode >= 500) {
      return chalk.red;
    }
    return chalk.yellow;
  }

export default function logger(req, res, next) {
    const req_path = req.url.replace(constant.BASE_API_ROUTE, '');
    const inTime = Date.now();

    res.on('finish', () => {
        const colorize = getStatusColor(res.statusCode);
        const colorstatus = colorize(`${res.statusCode} ${res.statusMessage}`);
        const outTime = Date.now();
        const responseTime = outTime - inTime;
        console.log(`${chalk.bold(req.method)} ${chalk.dim(req_path)} ${colorstatus} ${chalk.dim(responseTime + 'ms')}`);
        req.body ? console.log(`${chalk.dim(JSON.stringify(req.body, null, 2))}`) : null;
    });

    next();
}
