import { $ } from '../app/session';
import { Colors, LogLevel, Log } from './enums';
import { info, warn, error } from './native';

const PREFIX = 'SPX ';
const START = '\x1b[';
const END = '\x1b[0m';

/**
 * Dimmed Gray Text
 */
export const D = (text: string) => START + '90m' + text + END;

/**
 * Green Text
 */
export const G = (text: string) => START + '32m' + text + END;

/**
 * Red text
 */
export const R = (text: string) => START + '31m' + text + END;

/**
 * Yellow text
 */
export const Y = (text: string) => START + '33m' + text + END;

/**
 * Cyan text
 */
export const C = (text: string) => START + '36m' + text + END;

/**
 * Type Error
 *
 * Error handler for console logging operations. The function allows for
 * throws, warnings and other SPX related logs.
 */
export const log = (type: Log, message: string | string[], context?: any) => {

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
};
