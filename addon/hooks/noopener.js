import Hook from '../hook';

export default class NoOpener extends Hook {
  afterSanitizeAttributes(node) {
    if (node instanceof HTMLAnchorElement) {
      node.setAttribute('rel', 'noopener');
    }
  }
}
