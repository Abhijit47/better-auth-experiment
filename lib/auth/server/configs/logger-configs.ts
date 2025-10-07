import { type Logger } from 'better-auth';

const loggerConfigs = {
  disableColors: false,
  disabled: false,
  level: 'info',
  // log: (level, message, ...meta) => {
  //   const logMessage = `[${level.toUpperCase()}] ${message} ${
  //     meta ? JSON.stringify(meta) : ''
  //     }`;
  //   if (level === 'error') {
  //     console.error(logMessage);
  //   }
  //   else if (level === 'warn') {
  //     console.warn(logMessage);
  //   }
  //   else {
  //     console.log(logMessage);
  //   }
  // },
  log(level, message, ...args) {
    const logMessage = `[${level.toUpperCase()}] ${message} ${
      args ? JSON.stringify(args) : ''
    }`;
    if (level === 'error') {
      console.error(logMessage);
    } else if (level === 'warn') {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  },
} satisfies Logger;

export default loggerConfigs;
