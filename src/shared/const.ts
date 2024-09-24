import { s } from './native';

/**
 * UUID + UID Cache
 *
 * Ensures that no repeat identifers get generated
 */
export const Identifiers: Set<string|number> = s();

/**
 * Character Entities Mapping
 */
export const Entities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x2F;': '/',
  '&#x60;': '`',
  '&#x3D;': '='
};
