declare module "@brixtol/pjax" {

  /**
   * Pjax Support
   */
  export const supported: boolean

  /**
   * Fetches state page by url. Pass `false` to clear cache
   */
  export function connect(options?: IPjax.IConfigPresets): IPjax.IState

  /**
   * Fetches state page by url. Pass `false` to clear cache
   */
  export function cache(ref?: string | false): IPjax.IState

  /**
   * Reloads the current page
   */
  export function reload(): void

  /**
   * Shortcut helper function for generating a UUID using nanoid.
   */
  export function uuid(size?: string): string

  /**
   * Captures current `<body>` element and upon next history visit
   * will use the capture as replacement.
   */
  export function capture(url: string): void

  /**
   * Programmatic visit to location
   */
  export function visit(url: string, options?: IPjax.IVisit): void

  /**
   * Removes all pjax listeners
   */
  export function disconnect(): void

}


