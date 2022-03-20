import merge from 'mergerino';
import {
  defineProperty,
  getOwnPropertyNames,
  create
} from '../constants/native';

/**
 * Object
 *
 * This is a wrapper around the native `Object`
 * method. It allows us to create objects with
 * a `null` prototype
 */
export function object <T> ({
  writable,
  configurable,
  enumerable
}: Omit<PropertyDescriptor, 'value'> = {
  writable: false,
  configurable: false,
  enumerable: false
}) {

  const o: T = create(null);

  return {

    get all () { return o; },

    /**
     * Get Value
     *
     * Returns the value of a property on the object.
     */
    get <K extends keyof T> (prop: K) {

      return o[prop] || undefined;

    },

    /**
     * Set Value
     *
     * Updates an existing property value. If no record
     * exists, a new one is created.
     */
    set <K extends keyof T> (prop: K, value: unknown): T[K] {

      if (this.has(prop)) {
        defineProperty(o, prop, { value });
      } else {
        defineProperty(o, prop, { value, writable, configurable, enumerable });
      }

      return o[prop];

    },

    /**
     * Update Store Async
     *
     * Same as `update` but returns a promise
     */
    updateAsync <K extends keyof T> (prop: K, ...value: T[K][]): Promise<T[K]> {

      return new Promise((resolve) => {
        o[prop] = merge(o[prop] || {} as any, value);
        return resolve(o[prop]);
      });

    },

    /**
     * Update Store
     *
     * Updates an existing property value, merging
     * the passed value with the current record.
     */
    update <K extends keyof T> (prop: K, ...value: T[K][]): T[K] {

      o[prop] = merge(o[prop] || {} as any, value);

      return o[prop];

    },

    /**
     * Has Property
     *
     * Checks for the existence of property. Optionally
     * accepts a `pick` parameter for checking the existence
     * of a record value
     */
    has (id: string, pick?: string): boolean {

      if (!id) return false;

      const exists = id in o;

      return (pick && exists) ? pick in o[id] : exists;

    },

    /**
     * Delete
     *
     * Deletes a specific record from store. Returns
     * boolean when sucessful removal is executed.
     */
    delete (id: string): boolean {

      return this.has(id) ? delete o[id] : false;

    },

    /**
     * Clear
     *
     * Clears all records from store. Optionally provide a list
     * of targets to be cleared. Returns a list of snapshots
     * that remain.
     */
    clear (targets: string[] = []): any[] {

      const snapshots = [];

      getOwnPropertyNames(o).forEach(url => {
        if (!targets.includes(url)) delete o[url];
        else snapshots.push(o[url].snapshot);
      });

      return snapshots;

    }

  };

}
