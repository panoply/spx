import { $ } from '../app/session';
import { Errors } from './enums';
import { isArray, info, warn, error } from './native';

const PREFIX = '\x1b[96mSPX\x1b[0m ';

/**
 * Type Error
 *
 * Error handler for console logging operations. The function allows for
 * throws, warnings and other SPX related logs.
 */
export function log (type: Errors, message: string | string[], context?: any) {

  const { logLevel } = $.config;

  if (isArray(message)) message = message.join(' ');

  if ((
    type === Errors.TRACE && logLevel === 1
  ) || (
    type === Errors.INFO && (logLevel === 1 || logLevel === 2)
  )) {

    info(`${PREFIX}%c${message}`, `color: ${context || '#999'};`);

  } else if (type === Errors.WARN && logLevel < 4) {

    if (context) {
      warn(PREFIX + message, context);
    } else {
      warn(PREFIX + message);
    }

  } else if (type === Errors.ERROR || type === Errors.TYPE) {

    if (context) {
      error(PREFIX + message, context);
    } else {
      error(PREFIX + message);
    }

    try {
      if (type === Errors.TYPE) {
        throw new TypeError(message);
      } else {
        throw new Error(message);
      }
    } catch (e) {}
  }
}
