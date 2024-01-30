import spx from 'spx';

export class IFrame extends spx.Component {

  resize () {
    this.frameNode.style.height = this.frameNode.contentWindow.document.documentElement.scrollHeight + 'px';
  }

  frameNode: HTMLIFrameElement;

}
