import spx from 'spx';

export class Alias extends spx.Component({
  nodes: <const>[
    'feedback'
  ],
  state: {
    count: Number,
    limit: Number,
    notify: Boolean
  }
}) {

  increment () {
    if (this.state.count < this.state.limit) {
      ++this.state.count;
    } else if (!this.state.notify) {
      this.feedbackNode.innerText = `Reached Limit: ${this.state.limit}`;
      this.state.notify = true;
    }
  }

  decrement () {
    if (this.state.count === 0) return;
    --this.state.count;
    if (this.state.notify) {
      this.feedbackNode.innerText = '';
      this.state.notify = false;
    }
  }

}
