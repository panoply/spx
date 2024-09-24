import { o } from '../shared/native';

const forStr = (fn: (node: string) => void, nodes: string[], every: boolean = false, m = []) => {

  const s = nodes.length;
  const x = s === 1 ? nodes[0].split(',') : nodes;
  let i = -1;

  while (++i < s) {
    const v = m[m.push(fn(x[i])) - 1];
    if (every && !v) return false;
  }

  return every || m;

};

export const DoM = {
  toNode (node: HTMLElement) {
    return node;
  },
  getAttr (node: HTMLElement, ...args: string[]) {

    return args.length === 1
      ? node.getAttribute(args[0])
      : args.reduce((a, v) => Object.assign(a, { [v]: node.getAttribute(a) }), o());

  },
  setAttr (node: HTMLElement, ...args: [string, string] | [ Record<string, string> ]) {

    typeof args[0] === 'object'
      ? Object.keys(args[0]).forEach(k => node.setAttribute(k, args[0][k]))
      : node.setAttribute(args[0], args[1]);

    return this;

  },
  hasAttr (node: HTMLElement, ...args: string[]) {

    return forStr(a => node.hasAttribute(a), args, true);

  },
  removeAttr (node: HTMLElement, ...args: string[]) {

    forStr(a => !node.hasAttribute(a) || node.removeAttribute(a), args);
    return this;

  },
  addClass (node: HTMLElement, ...args: string[]) {

    forStr(c => node.classList.add(c), args);
    console.log(node, args);
    return this;

  },
  hasClass (node: HTMLElement, ...args: string[]) {

    return forStr(c => node.classList.contains(c), args, true);

  },
  removeClass (node: HTMLElement, ...args: string[]) {

    forStr(c => node.classList.remove(c), args);
    return this;

  },
  toggleClass (node: HTMLElement, from: string, ...to: string[]) {

    this.hasClass(node, from)
      ? this.removeClass(node, from).addClass(node, ...to)
      : this.addClass(node, from);

    return this;

  },
  on () {},
  off () {},
  watch () {},
  update () {}

};
