import { $ } from '../app/session';
import { Colors, LogLevel, LogType } from './enums';
import { isArray, info, warn, error } from './native';

const PREFIX = 'SPX ';

/**
 * Type Error
 *
 * Error handler for console logging operations. The function allows for
 * throws, warnings and other SPX related logs.
 */
export function log (type: LogType, message: string | string[], context?: any) {

  const LEVEL = $.logLevel;

  if (LEVEL > LogType.INFO && type <= LogType.INFO) return;

  if (isArray(message)) message = message.join(' ');

  if ((
    type === LogType.INFO ||
    type === LogType.VERBOSE
  ) && (
    LEVEL === LogLevel.VERBOSE ||
    LEVEL === LogLevel.INFO
  )) {

    info(`${PREFIX}%c${message}`, `color: ${context || Colors.GRAY};`);

  } else if (
    type === LogType.WARN &&
    LEVEL <= LogLevel.WARN
  ) {

    if (context) {
      warn(PREFIX + message, context);
    } else {
      warn(PREFIX + message);
    }

  } else if (
    type === LogType.ERROR ||
    type === LogType.TYPE
  ) {

    if (context) {
      error(PREFIX + message, context);
    } else {
      error(PREFIX + message);
    }

    try {
      if (type === LogType.TYPE) {
        throw new TypeError(message);
      } else {
        throw new Error(message);
      }
    } catch (e) {}

  }
}
