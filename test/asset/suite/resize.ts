function resize (event: MouseEvent & { target: HTMLElement }, sizeProp: string, posProp: string) {

  const elem = event.target;
  const prev = elem.previousElementSibling as HTMLElement;
  const next = elem.nextElementSibling as HTMLElement;

  if (!prev || !next) return;

  event.preventDefault();

  let prevSize = prev[sizeProp];
  let nextSize = next[sizeProp];
  let lastPos = event[posProp];

  const sumSize = prevSize + nextSize;
  const prevGrow = Number(prev.style.flexGrow);
  const nextGrow = Number(next.style.flexGrow);
  const sumGrow = prevGrow + nextGrow;

  function onMouseMove (event: MouseEvent) {

    let pos = event[posProp];

    const d = pos - lastPos;

    prevSize += d;
    nextSize -= d;

    if (prevSize < 0) {
      nextSize += prevSize;
      pos -= prevSize;
      prevSize = 0;
    }
    if (nextSize < 0) {
      prevSize += nextSize;
      pos += nextSize;
      nextSize = 0;
    }

    const prevGrowNew = sumGrow * (prevSize / sumSize);
    const nextGrowNew = sumGrow * (nextSize / sumSize);

    prev.style.flexGrow = String(prevGrowNew);
    next.style.flexGrow = String(nextGrowNew);

    lastPos = pos;

  }

  function onMouseUp () {

    // Change cursor to signal a state's change: stop resizing.
    document.documentElement.style.cursor = 'default';
    elem.style.cursor = posProp === 'pageX'
      ? 'ew-resize'
      : 'ns-resize';

    removeEventListener('mousemove', onMouseMove);
    removeEventListener('mouseup', onMouseUp);

  }

  addEventListener('mousemove', onMouseMove);
  addEventListener('mouseup', onMouseUp);
}

export function code () {

  let fixedWidth: boolean = false;

  document.body.addEventListener('mousedown', function (event: MouseEvent & { target: HTMLElement }) {

    // Used to avoid cursor's flickering
    const html = document.documentElement;
    const target = event.target;

    if (target.nodeType !== 1 || target.tagName !== 'FLEX-RESIZER') return;

    const parent = target.parentElement;
    const h = parent.classList.contains('h');
    const v = parent.classList.contains('v');

    if (!fixedWidth) {
      const c = parent.querySelector<HTMLElement>('.fixed-width');
      if (c) {
        c.style.width = `${c.offsetWidth}px`;
        fixedWidth = true;
      }
    }

    if (h && v) return;

    if (h) {

      // Change cursor to signal a state's change: begin resizing on H.
      target.style.cursor = 'col-resize';
      html.style.cursor = 'col-resize'; // avoid cursor's flickering

      // use offsetWidth versus scrollWidth (and clientWidth) to avoid splitter's jump on resize when a flex-item content overflow (overflow: auto).
      resize(event, 'offsetWidth', 'pageX');

    } else if (v) {

      // Change cursor to signal a state's change: begin resizing on V.
      target.style.cursor = 'row-resize';
      html.style.cursor = 'row-resize'; // avoid cursor's flickering

      resize(event, 'offsetHeight', 'pageY');
    }
  });
}
