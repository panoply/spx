import { $ } from '../app/session';
import { Colors, LogLevel, Log } from './enums';
import { info, warn, error } from './native';

const PREFIX = 'SPX ';

/**
 * Type Error
 *
 * Error handler for console logging operations. The function allows for
 * throws, warnings and other SPX related logs.
 */
export function log (type: Log, message: string | string[], context?: any) {

  const LEVEL = $.logLevel;

  if (LEVEL > Log.INFO && type <= Log.INFO) return;

  if (Array.isArray(message)) message = message.join(' ');

  if ((
    type === Log.INFO ||
    type === Log.VERBOSE
  ) && (
    LEVEL === LogLevel.VERBOSE ||
    LEVEL === LogLevel.INFO
  )) {

    info(`${PREFIX}%c${message}`, `color: ${context || Colors.GRAY};`);

  } else if (
    type === Log.WARN &&
    LEVEL <= LogLevel.WARN
  ) {

    if (context) {
      warn(PREFIX + message, context);
    } else {
      warn(PREFIX + message);
    }

  } else if (
    type === Log.ERROR ||
    type === Log.TYPE
  ) {

    if (context) {
      error(PREFIX + message, context);
    } else {
      error(PREFIX + message);
    }

    try {
      if (type === Log.TYPE) {
        throw new TypeError(message);
      } else {
        throw new Error(message);
      }
    } catch (e) {}

  }
}
