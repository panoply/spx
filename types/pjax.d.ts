
export default interface Pjax {

  /**
   * Pjax Support
   */
  supported: boolean

  /**
   * Fetches state page by url. Pass `false` to clear cache
   */
  connect(options: IPjax.IConfigPresets): IPjax.IState

  /**
   * Fetches state page by url. Pass `false` to clear cache
   */
  cache(ref?: string | false): IPjax.IState

  /**
   * Reloads the current page
   */
  reload(): void

  /**
   * Programmatic visit to location
   */
  visit(url: string, options: IPjax.IVisit): void

  /**
   * Removes all pjax listeners
   */
  disconnect(): void


}

