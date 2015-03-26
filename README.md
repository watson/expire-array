# expire-array

An array-like structure that removes each element after a given timeout.
Or think of it as a rolling window on top of an array which only
contains the most recent elements.

[![Build status](https://travis-ci.org/watson/expire-array.svg?branch=master)](https://travis-ci.org/watson/expire-array)

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)

## Installation

```
npm install expire-array
```

## Example Usage

```js
// Initialize with a timeout of 10 seconds
var arr = require('expire-array')(1000 * 10)

// Add elements to the array using .push()
arr.push(1)

// Retrive all elements from the array using .all()
arr.all() // => [1]

setTimeout(function () {
  // after 5 seconds
  arr.push(2)
  console.log(arr.all()) // outputs: [1, 2]
}, 1000 * 5)

setTimeout(function () {
  // after 11 seconds
  console.log(arr.all()) // outputs: [2]
}, 1000 * 11)

setTimeout(function () {
  // after 16 seconds
  console.log(arr.all()) // outputs: []
}, 1000 * 16)
```

## API

#### Constructor

Initialize `expire-array` with a timeout in milliseconds:

```js
var ExpireArray = require('expire-array')

var arr = ExpireArray(1000 * 60) // one minute
```

#### `arr.push(elm)`

Add an element to the end of the array.

#### `arr.all()`

Returns all the elements in the array that have not expired. The
returned array is a clone and none of its elements will ever expire.

#### `arr.forEach(callback[, thisArg])` (wrapper method)

Just like the equivalent
[`Array.prototype.forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
method, this `forEach()` method executes a provided function once per
array element.

##### Parameters

- `callback` - Function that produces an element of the new Array,
  taking two arguments
- `thisArg` - Optional. Value to use as this when executing `callback`

**Callback arguments:**

- `currentValue` - The current element being processed in the array
- `index` - The index of the current element being processed in the
  array

#### `arr.map(callback[, thisArg])` (wrapper method)

Just like the equivalent
[`Array.prototype.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
method, this `map()` method creates a new array with the results of
calling a provided function on every element in this array.

##### Parameters

- `callback` - Function that produces an element of the new Array,
  taking two arguments
- `thisArg` - Optional. Value to use as this when executing `callback`

**Callback arguments:**

- `currentValue` - The current element being processed in the array
- `index` - The index of the current element being processed in the
  array

#### `arr.every(callback[, thisArg])` (wrapper method)

Just like the equivalent
[`Array.prototype.every()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
method, this `every()` method tests whether all elements in the array
pass the test implemented by the provided function.

##### Parameters

- `callback` - Function to test for each element, taking two arguments
- `thisArg` - Optional. Value to use as this when executing `callback`

**Callback arguments:**

- `currentValue` - The current element being processed in the array
- `index` - The index of the current element being processed in the
  array

#### `arr.some(callback[, thisArg])` (wrapper method)

Just like the equivalent
[`Array.prototype.some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
method, this `some()` method tests whether some element in the array
passes the test implemented by the provided function.

##### Parameters

- `callback` - Function to test for each element, taking two arguments
- `thisArg` - Optional. Value to use as this when executing `callback`

**Callback arguments:**

- `currentValue` - The current element being processed in the array
- `index` - The index of the current element being processed in the
  array

## License

MIT
