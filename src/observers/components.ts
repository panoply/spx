import { $ } from '../app/session';
import { getComponents } from '../components/connect';

export function connect () {

  if ($.observe.components) return;

  if ($.page.components.length === 0) return getComponents();

  $.observe.components = true;

}

export function disconnect () {

  if (!$.observe.components) return;

  $.observe.components = false;

}
