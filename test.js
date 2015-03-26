'use strict'

var test = require('tape')
var ExpireArray = require('./')

test('invalid timeout', function (t) {
  t.throws(function () {
    ExpireArray('bad')
  })
  t.throws(function () {
    ExpireArray()
  })
  t.end()
})

test('empty', function (t) {
  var arr = ExpireArray(50)
  t.deepEqual(arr.all(), [])
  t.end()
})

test('full', function (t) {
  var arr = ExpireArray(50)
  arr.push(1)
  arr.push(2)
  arr.push(3)
  t.deepEqual(arr.all(), [1, 2, 3])
  t.end()
})

test('expire', function (t) {
  var ts = 50
  var arr = ExpireArray(ts)
  arr.push(1)
  setTimeout(function () {
    arr.push(2)
    t.deepEqual(arr.all(), [1, 2])
  }, ts / 2)
  setTimeout(function () {
    t.deepEqual(arr.all(), [2])
  }, ts + ts / 4)
  setTimeout(function () {
    t.deepEqual(arr.all(), [])
    t.end()
  }, ts * 2)
})

test('clone', function (t) {
  var arr = ExpireArray(50)
  arr.push(1)
  arr.push(2)
  var clone = arr.all()
  clone.shift()
  t.deepEqual(clone, [2])
  t.deepEqual(arr.all(), [1, 2])
  t.end()
})

test('pop', function (t) {
  var arr = ExpireArray(50)
  arr.push(1)
  arr.push(2)
  t.equal(arr.pop(), 2)
  t.deepEqual(arr.all(), [1])
  setTimeout(function () {
    t.deepEqual(arr.all(), [])
    t.end()
  }, 100)
})

test('shift', function (t) {
  var arr = ExpireArray(100)
  arr.push(1)
  setTimeout(function () {
    arr.push(2)
    t.equal(arr.shift(), 1)
    t.deepEqual(arr.all(), [2])
    setTimeout(function () {
      // should not remove the last element even though 100+ ms have passed
      // since the first push
      t.deepEqual(arr.all(), [2])
    }, 35)
    setTimeout(function () {
      t.deepEqual(arr.all(), [])
      t.end()
    }, 125)
  }, 75)
})
