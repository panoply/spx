import { Options as BrowserSyncOptions } from 'browser-sync';

export default class Eleventy {
  constructor(input: string, output: string);

  init(): Promise<any>;
  watch(): Promise<void>;
  serve(port: number): void;
  write(): Promise<void>;

  getVersion(): string;
  getHelp(): string;

  setConfigPathOverride(configPath: string): void;
  setPathPrefix(pathPrefix: string): void;
  setDryRun(isDryRun: boolean): void;
  setIncrementalBuild(isIncremental: boolean): void;
  setPassthroughAll(isPassthroughAll: boolean): void;
  setFormats(formats: string): void;
}

export type TemplateEngineShortName =
  | 'html'
  | 'md'
  | '11ty.js'
  | 'liquid'
  | 'njk'
  | 'hbs'
  | 'mustache'
  | 'ejs'
  | 'haml'
  | 'pug'
  | 'jstl';

export type EleventyPlugin<Options = undefined> =
  | EleventyPluginFunction<Options>
  | EleventyPluginObject<Options>;
export type EleventyPluginFunction<Options> = (
  eleventyConfig: EleventyConfig,
  options: Options
) => void;
export interface EleventyPluginObject<Options> {
  initArguments?: object;
  configFunction: EleventyPluginFunction<Options>;
}

export type AsyncFilterCallback = (
  error: unknown | null,
  result?: any
) => void;

export interface EleventyConfig {
  /**
   * Enable quiet mode to reduce console noise
   */
  setQuietMode(quiet: boolean): void;

  setTemplateFormats(formats: readonly string[]): void;

  // Data Deep Merge
  setDataDeepMerge(deepMerge: boolean): void;

  // Customize front matter parsing
  setFrontMatterParsingOptions(options: any): void;

  // Watch and serve configuration
  setWatchJavaScriptDependencies(watch: boolean): void;
  setBrowserSyncConfig(config: BrowserSyncOptions): void;
  setWatchThrottleWaitTime(ms: number): void;
  addWatchTarget(target: string): void;

  // Ignore files
  setUseGitIgnore(use: boolean): void;

  addTransform(
    transformName: string,
    transform: (
      content: string,
      outputPath: string
    ) => string | PromiseLike<string>
  ): void;

  addLinter(
    linterName: string,
    linter: (content: string, inputPath: string, outputPath: string) => void
  ): void;

  addPassthroughCopy(path: string | { [input: string]: string }): void;

  // Filters
  addLiquidFilter(filterName: string, filter: (...args: any[]) => string): void;
  addNunjucksFilter(
    filterName: string,
    filter: (...args: any[]) => string
  ): void;
  addNunjucksAsyncFilter(
    filterName: string,
    filter: (callback: AsyncFilterCallback) => void
  ): void;
  addNunjucksAsyncFilter(
    filterName: string,
    filter: (arg: any, callback: AsyncFilterCallback) => void
  ): void;
  addNunjucksAsyncFilter(
    filterName: string,
    filter: (arg1: any, arg2: any, callback: AsyncFilterCallback) => void
  ): void;
  addHandlebarsHelper(
    filterName: string,
    filter: (...args: any[]) => string
  ): void;
  addJavaScriptFunction(
    filterName: string,
    filter: (...args: any[]) => string | PromiseLike<string>
  ): void;
  addFilter(filterName: string, filter: (...args: any[]) => string): void;
  getFilter(filterName: string): (...args: any[]) => string;

  // Shortcodes
  addLiquidShortcode(
    shortcodeName: string,
    filter: (...args: any[]) => string | PromiseLike<string>
  ): void;
  addNunjucksShortcode(
    shortcodeName: string,
    filter: (...args: any[]) => string | PromiseLike<string>
  ): void;
  addHandlebarsShortcode(
    shortcodeName: string,
    filter: (...args: any[]) => string
  ): void;
  addJavaScriptFunction(
    shortcodeName: string,
    filter: (...args: any[]) => string | PromiseLike<string>
  ): void;
  addShortcode(
    shortcodeName: string,
    filter: (...args: any[]) => string | PromiseLike<string>
  ): void;
  addPairedLiquidShortcode(
    shortcodeName: string,
    filter: (content: string, ...args: any[]) => string | PromiseLike<string>
  ): void;
  addPairedNunjucksShortcode(
    shortcodeName: string,
    filter: (content: string, ...args: any[]) => string | PromiseLike<string>
  ): void;
  addPairedHandlebarsShortcode(
    shortcodeName: string,
    filter: (content: string, ...args: any[]) => string
  ): void;
  addPairedShortcode(
    shortcodeName: string,
    filter: (content: string, ...args: any[]) => string | PromiseLike<string>
  ): void;

  addPlugin(plugin): void;

  on(
    event: 'beforeBuild' | 'afterBuild' | 'beforeWatch',
    handler: () => void
  ): void;
}

export type LocalConfig = LocalConfigFunction | LocalConfigObject;
export type LocalConfigFunction = (
  eleventyConfig: EleventyConfig
) => LocalConfigObject | undefined;
export interface LocalConfigObject {
  dir?: {
    /**
     * Input directory
     */
    input?: string;
    /**
     * Output directory
     */
    output?: string;
    /**
     * Directory for includes
     */
    includes?: string;
    /**
     * Directory for layouts
     */
    layouts?: string;
    /**
     * Directory for global data files
     */
    data?: string;
  };

  /**
   * Default template engine for global data files
   */
  dataTemplateEngine?: TemplateEngineShortName | false;
  /**
   * Default template engine for markdown files
   */
  markdownTemplateEngine?: TemplateEngineShortName | false;
  /**
   * Default template engine for HTML files
   */
  htmlTemplateEngine?: TemplateEngineShortName | false;
  /**
   * Template formats that should be transformed
   */
  templateFormats?: string | string[];

  /**
   * URL path prefix
   */
  pathPrefix?: string;

  /**
   * Suffix that will be added to output files
   * if `dir.input` and `dir.output` match.
   */
  htmlOutputSuffix?: string;
  /**
   * Set file suffix for template and directory specific data files.
   */
  jsDataFileSuffix?: string;

  /**
   * Disable passthrough file copy
   */
  passthroughFileCopy?: boolean;
}

