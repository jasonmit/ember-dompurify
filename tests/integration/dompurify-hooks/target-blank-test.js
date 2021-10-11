import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | DOMPurify Hooks | target-blank', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    await render(hbs`
      {{dom-purify '<a src="http://google.com">Link</a>' hook='target-blank'}}
    `);

    assert.dom('a').hasAttribute('target', '_blank');
    assert.dom('a').hasAttribute('rel', 'noopener');
    assert.dom('a').hasText('Link');
  });
});
