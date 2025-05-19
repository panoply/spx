import { LiteralUnion } from 'types';

export interface HTTPConfig {
  /**
   * The URL for the request, constructed with path and optional base origin.
   *
   * > This is optional, you can pass url as the first argument of `spx.http('/url', {})`
   * @type {URL}
   */
  url?: URL;
  /**
   * The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
   *
   * @default 'GET'
   */
  method?: LiteralUnion< 'HEAD' | 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH', string>;
  /**
   * The expected response type (e.g., '', 'arraybuffer', 'blob', 'document', 'json', 'text').
   *
   * @default
   * 'json'
   */
  response?: XMLHttpRequestResponseType;
  /**
   * Query parameters to append to the URL.
   *
   * @default
   * {}
   */
  query?: Record<string, string> | URLSearchParams;
  /**
   * The request body, typically for POST/PUT requests (e.g., string, FormData, Blob).
   *
   * @default
   * undefined
   */
  body?: any;
  /**
   * Custom headers for the request.
   *
   * @default {}
   */
  headers?: Record<string, string>;
  /**
   * Timeout duration for the request in milliseconds.
   *
   * @default 0
   */
  timeout?: number;
  /**
   * A username for HTTP authorization.
   *
   * @default undefined
   */
  user?: string;
  /**
   * A password for HTTP authorization. This option is provided for XMLHttpRequest compatibility,
   * but you should avoid using it because it sends the password in plain text over the network.
   *
   * @default undefined
   */
  pass?: string;
  /**
   * Exposes the underlying XMLHttpRequest object for low-level configuration and optional
   * replacement (by returning a new XHR).
   */
  config?: (xhr: XMLHttpRequest) => void | XMLHttpRequest;
}
