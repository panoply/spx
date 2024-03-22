# Methods

In addition to Lifecycle events, you also have a list of methods available. Methods will allow you some basic programmatic control of the SPX session occurring and provides access to the cache store, snapshot store and various other operational utilities.

```js
import spx from 'spx'

spx.supported: boolean

spx.connect(options?: {}): (callback: (session?: ISession) => void) => void

spx.session(store?: string, merge?:{}): ISession

spx.hydrate(url?: string, targets: string[]): Promise<Page>

spx.fetch(url: string): Promise<Document>

spx.prefetch(string | Element): Promise<Page>

spx.visit(url: string, options?:{}): Promise<Page>

spx.store(url?: string, merge?:{}): Page{}

spx.capture(targets: string[]): Promise<Element[]>

spx.clear(url?: string): void

spx.reload(): Page

spx.disconnect(): void

```
