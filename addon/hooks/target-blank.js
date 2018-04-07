import Hook from '../hook';

export default class TargetBlankHook extends Hook {
  afterSanitizeAttributes(node) {
    if ('target' in node) {
      node.setAttribute('target', '_blank');
    }
  }
}
