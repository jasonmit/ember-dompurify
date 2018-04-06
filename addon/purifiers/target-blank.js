import Transform from '../transform';

export default class TargetBlankTransform extends Transform {
  afterSanitizeAttributes(node) {
    if ('target' in node) {
      node.setAttribute('target', '_blank');
    }
  }
}
