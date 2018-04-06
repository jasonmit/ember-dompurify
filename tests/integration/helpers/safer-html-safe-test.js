import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import createPurify, { Transform } from 'ember-dompurify';

module('Integration | Helper | safer-html-safe', function(hooks) {
  setupRenderingTest(hooks);

  test('it exists', function(assert) {
    assert.ok(typeof createPurify, 'function');
    assert.ok(typeof Transform, 'function');
  });

  test('it renders', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{safer-html-safe inputValue}}`);

    assert.equal(this.element.innerHTML.trim(), '1234');
  });

  test('it works', async function(assert) {
    await render(hbs`{{safer-html-safe '<img src=x onerror=alert(1) />'}}`);

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it accepts dompurify options (normalized)', async function(assert) {
    await render(
      hbs`{{safer-html-safe '<img src=x data-srcset="foobar" />' allow-data-attr=false}}`
    );

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it accepts dompurify options', async function(assert) {
    await render(
      hbs`{{safer-html-safe '<img src=x data-srcset="foobar" />' ALLOW_DATA_ATTR=false}}`
    );

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it invokes hooks', async function(assert) {
    assert.expect(2); /* once for src, once for onerror */
    this.set('uponSanitizeAttribute', () => assert.ok(true));

    await render(
      hbs`{{safer-html-safe '<img src="x" onerror=alert(1) />' uponSanitizeAttribute=uponSanitizeAttribute}}`
    );
  });

  test('it accepts a transform', async function(assert) {
    assert.expect(10);

    this.set(
      'transform',
      class AssertionTransform extends Transform {
        beforeSanitizeAttributes() {
          assert.ok(true);
        }

        afterSanitizeAttributes() {
          assert.ok(true);
        }

        beforeSanitizeShadowDOM() {
          assert.ok(true);
        }

        uponSanitizeShadowNode() {
          assert.ok(true);
        }

        afterSanitizeShadowDOM() {
          assert.ok(true);
        }

        beforeSanitizeElements() {
          assert.ok(true);
        }

        afterSanitizeElements() {
          assert.ok(true);
        }

        uponSanitizeAttribute() {
          assert.ok(true);
        }

        uponSanitizeElement(el) {
          if (!(el instanceof self.HTMLAnchorElement)) return;

          assert.ok(true);
          assert.ok(this instanceof AssertionTransform);
        }
      }
    );

    await render(hbs`{{safer-html-safe '<a>' transform=transform}}`);
  });

  test('it can transform elements', async function(assert) {
    assert.expect(1);

    this.set(
      'transform',
      class AttributeBlankTransform extends Transform {
        afterSanitizeAttributes(node) {
          if ('target' in node) {
            node.setAttribute('target', '_blank');
          }
        }
      }
    );

    await render(
      hbs`{{safer-html-safe '<a src="http://google.com">Link</a>' transform=transform}}`
    );
    assert.equal(
      this.element.innerHTML.trim(),
      '<a src="http://google.com" target="_blank">Link</a>'
    );
  });
});
