import { logger, consoleTransport } from 'react-native-logs';

export const log = logger.createLogger({
  severity: import.meta.env.DEV ? 'debug' : 'error',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
});