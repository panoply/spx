import { $ } from '../app/session';
import { forNode } from '../shared/utils';

function onMutation (mutations: MutationRecord[], observer: MutationObserver) {

  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      console.log(mutation.target.parentElement);
    } else if (mutation.type === 'attributes') {
      console.log(`The ${mutation.attributeName} attribute was modified.`);
    }
  }
};

export function connect () {

  if (!$.observe.fragments) return;

  const observer = new MutationObserver(onMutation);

  forNode($.config.fragments.join(), node => {

    // Start observing the target node for configured mutations
    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: false
    });

  });

  $.observe.fragments = true;
  // Later, you can stop observing
  // observer.disconnect();
}

export function disconnect () {

}
