import merge from 'mergerino';
import { assign, defineProperty, getOwnPropertyNames, create } from '../constants/native';

/**
 * Object
 *
 * This is a wrapper around the native `Object`
 * method. It allows us to create objects with
 * a `null` prototype
 */
export function object <T> ({
  writable,
  configurable = true,
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
        defineProperty(o, prop, {
          value
        });
      } else {
        defineProperty(o, prop, {
          value,
          writable,
          configurable,
          enumerable
        });
      }

      return o[prop];

    },

    /**
     * Set Value
     *
     * Updates an existing property value, merging
     * the passed value with the current record.
     */
    update <K extends keyof T> (prop: K, ...value: T[K][]): T[K] {

      return assign(o[prop], merge(o[prop] as any, ...value));

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
     * Clears all snapshots or if an `id` is provided,
     * will only clear that specific record. Returns
     * boolean when sucessful clear is executed.
     */
    delete (id: string): boolean {

      return this.has(id) ? delete o[id] : false;

    },

    /**
     * clear
     *
     * Clears all snapshots or if an `id` is provided,
     * will only clear that specific record. Returns
     * boolean when sucessful clear is executed.
     */
    clear (exclude: string[] = []): boolean {

      getOwnPropertyNames(o).forEach(url => {
        if (exclude.indexOf(url) !== -1) delete o[url];
      });

      return true;

    }

  };

}
