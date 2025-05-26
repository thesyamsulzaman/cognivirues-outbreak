export class TextMessage {
  text: any;
  onComplete: any;
  stateContext: any;
  withNarrator: any;

  constructor(stateContext, { withNarrator, text, onComplete }) {
    this.stateContext = stateContext;
    this.text = text;
    this.onComplete = onComplete;
    this.withNarrator = withNarrator;
  }

  done() {
    this.stateContext.textMessage = null;
    this.onComplete();
  }

  init() {
    this.stateContext.textMessage = this;
  }
}
