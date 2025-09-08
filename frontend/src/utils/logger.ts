interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

const createLogger = (): Logger => {
  const isDev = import.meta.env.DEV;

  return {
    debug: (message: string, ...args: unknown[]) => {
      if (isDev) console.debug(`[DEBUG] ${message}`, ...args);
    },
    info: (message: string, ...args: unknown[]) => {
      if (isDev) console.info(`[INFO] ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]) => {
      console.warn(`[WARN] ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]) => {
      console.error(`[ERROR] ${message}`, ...args);
    },
  };
};

export const log = createLogger();
