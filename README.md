# ember-dompurify

[![npm Version][npm-badge]][npm]
[![Build Status](https://travis-ci.org/jasonmit/ember-dompurify.svg?branch=master)](https://travis-ci.org/jasonmit/ember-dompurify)

A wrapper around [DOMPurify](https://github.com/cure53/DOMPurify).

## Installation

```sh
ember i ember-dompurify
```

## Helper usage


### Basic

```hbs
{{dom-purify '<img src="x" onerror=alert(1) />'}}
```

Returns an htmlSafe string:
```html
<img src="x">
```

### Advanced

```js
// app/purifiers/target-blank.js
import { Transform } from 'ember-dompurify';

export default class TargetBlankTransform extends Transform {
  afterSanitizeAttributes(node) {
    if ('target' in node) {
      node.setAttribute('target', '_blank');
    }
  }
}
```

```hbs
{{dom-purify '<a src="https://google.com">Link</a>' transform='target-blank'}}
```

Result:

```html
<a src="https://google.com" target="_blank">Link</a>
```

## API

```js
import createDOMPurify from 'ember-dompurify';

const dompurify = createDOMPurify(window);
dompurify.sanitize('<img src="x" onerror=alert(1)/>'); // -> type: String, result: `<img src="x">`
```

## Supported Helper Attributes

All DOMPurify options are supported, [DOMPurify options](https://github.com/cure53/DOMPurify#can-i-configure-it).

Example:
```hbs
{{dom-purify model.notes keep-content=true}}
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-dompurify`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md)

[npm]: https://www.npmjs.org/package/ember-dompurify
[npm-badge]: https://img.shields.io/npm/v/ember-dompurify.svg?style=flat-square
