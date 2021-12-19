import { create } from '../constants/native';

/**
 * Ready connections
 */
export const connect: {
  controller: boolean;
  history: boolean;
  href: boolean;
  hover: boolean;
  intersect: boolean;
  scroll: boolean;
} = create(
  {
    controller: false,
    history: false,
    href: false,
    hover: false,
    intersect: false
  }
);
