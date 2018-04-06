ember-dompurify
==============================================================================

## Installation
------------------------------------------------------------------------------

```sh
ember i ember-dompurify
```

## Helper usage

```hbs
{{safer-html-safe '<img src="x" onerror=alert(1) />'}}
```

Returns an htmlSafe string:
```html
<img src="x">
```

## API

```js
import createDOMPurify from 'ember-dompurify';

const dompurify = createDOMPurify(window);
dompurify.sanitize('<img src="x" onerror=alert(1)/>'); // -> type: String, result: `<img src="x">`
```

## Options

[DOMPurify options](https://github.com/cure53/DOMPurify#can-i-configure-it)

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

This project is licensed under the [MIT License](LICENSE.md).
