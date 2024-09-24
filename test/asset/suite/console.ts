export const methods = [ 'log', 'warn', 'info', 'debug', 'error' ];

export interface Log {
  function: string;
  args: any[];
  ts: number;
}

export class Console {

  private static captures: Log[];
  static override = false;

  constructor () {
    Console.captures = [];
  }

  // Core
  private static saveLog (functionName: string, args: [any]) {

    const finalArgs = args.map(arg => {
      if (typeof arg === 'object') {
        if (arg instanceof Error) {
          return JSON.stringify(arg, Object.getOwnPropertyNames(arg));
          // todo: some way to identify this string from other json stringified strings
          // https://stackoverflow.com/a/17936621/11565176
        }
        return JSON.stringify(arg);
      } else {
        return arg;
      }
    });
    Console.captures.push({
      function: functionName,
      args: finalArgs,
      ts: Date.now()
    });
  }

  private static setNewFunctions (allowOriginalExecution = false) {
    const proxyHandler = {
      apply: (target: Function, thisArgument: any, argumentsList: [any]) => {
        Console.saveLog(target.name, argumentsList);
        target.bind(thisArgument);
        if (allowOriginalExecution) return target(...argumentsList);

      }
    };

    methods.forEach(funcName => {
      if (!Console.override) {
        // @ts-ignore
        console.original[funcName] = console[funcName];
      }
      // @ts-ignore
      console[funcName] = new Proxy(console[funcName], proxyHandler);
    });
    Console.override = true;
  }

  private static resetToOriginalFunctions () {
    if (Console.override) {
      methods.forEach(funcName => {
        // @ts-ignore
        console[funcName] = console.original[funcName];
      });
    }
    Console.override = false;
  }

  // APIS
  start (allowOriginalExecution = false) {
    Console.captures = [];
    Console.setNewFunctions(allowOriginalExecution);
  }

  stop () {
    Console.resetToOriginalFunctions();
  }

  flush () {
    Console.captures = [];
  }

  getCaptures () {
    return Console.captures;
  }

  static makeOriginalLog (log: Log) {
    Console.resetToOriginalFunctions();

    if (methods.includes(log.function)) {
      const finalArgs = log.args.map(arg => {
        if (typeof arg === 'string') {
          try {
            // return JSON.parse(arg);

            // hacky for now
            const obj = JSON.parse(arg);
            return obj.stack ? obj.stack : obj;
          } catch {
            return arg;
          }
        }
        return arg;
      });
      // @ts-ignore
      console[log.function](...finalArgs);
    } else {
      throw Error('Invalid Log type');
    }
  }

}
