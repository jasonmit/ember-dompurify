import Hook from '../hook';

export default class TargetBlankHook extends Hook {
  afterSanitizeAttributes(node) {
    if (node instanceof HTMLAnchorElement) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener');
    }
  }
}
