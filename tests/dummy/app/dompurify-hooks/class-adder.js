import Hook from 'ember-dompurify/hook';

export default class TargetBlankHook extends Hook {
  afterSanitizeAttributes(node) {
    if (node instanceof HTMLAnchorElement) {
      node.setAttribute('class', 'foobar');
    }
  }
}
