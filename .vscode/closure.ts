import { SPX } from 'spx'


export function Closure(this: SPX.This, {
  state,
  toggleNode,
  outputNode,
  productNode,
  buttonNodes
}: SPX.Params<
  {
    name: string;
    color: string;
    clicks: number;
  },
  [
    'output',
    'toggle',
    'product',
    'button'
  ]
>): SPX.Closure {


  const toggle = () => {

  }

  const expand = () => {

  }

  return {
    toggle,
    expand,
    oninit() {},
    onload() {},
    onexit() {},
  }
}