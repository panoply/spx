import { IPage, IPresets } from "./store";

declare module "@brixtol/pjax" {
  /**
   * Pjax Support
   */
  export const supported: boolean;

  /**
   * Fetches state page by url. Pass `false` to clear cache
   */
  export function connect(options?: IPresets): IPage;

  /**
   * Fetches state page by url. Pass `false` to clear cache
   */
  export function cache(ref?: string | false): IPage;

  /**
   * Clear cache. Pass in a `url` parameter to clear specific page
   * else a complete cache clear will be triggered.
   */
  export function clear(url?: string): IPage;

  /**
   * Reloads the current page
   */
  export function reload(): void;

  /**
   * Shortcut helper function for generating a UUID using nanoid.
   */
  export function uuid(size?: string): string;

  /**
   * Captures current `<body>` element and upon next history visit
   * will use the capture as replacement.
   */
  export function capture(url: string): string;

  /**
   * Programmatic visit to location
   */
  export function visit(url: string, options?: IPage): Promise<IPage | void>;

  /**
   * Removes all pjax listeners
   */
  export function disconnect(): void;
}
