/* eslint-disable no-unused-vars */
import { $ } from '../app/session';
import { Colors, LogLevel, Æ } from './enums';

class SPXError extends Error {

  constructor (message: string, public context?: any) {
    super(message);
    this.name = 'SPX Error';
    if (context) this.context = context;
  }

}

const PREFIX = 'SPX ';
const START = '\x1b[';
const END = '\x1b[0m';

/**
 * Color
 */
export const C = (COLOR: Æ, text: string) => START + COLOR + text + END;

/**
 * Console Debug
 */
export const debug = (message: string | string[], color: Colors = Colors.GRAY) => {
  if ($.logLevel === LogLevel.DEBUG) {
    // @ts-ignore
    console.debug('%c' + PREFIX + (Array.isArray(message) ? message.join(' ') : message), `color: ${color};`);
  }
};

/**
 * Console Warnings
 */
export const warn = (message: string, context?: any) => {
  if ($.logLevel >= LogLevel.WARN) {
    context ? console.warn(PREFIX + message, context) : console.warn(PREFIX + message);
  }
};

/**
 * Console Info
 */
export const info = (...message: string[]) => {
  if ($.logLevel === LogLevel.INFO) {
    console.info(PREFIX + C(Æ.Gray, message.join('')));
  }
};

/**
 * Console Error (Will throw)
 */
export const error = (message: string, context?: any) => {
  throw new SPXError(message, context);
};
