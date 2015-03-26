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
  var arr = ExpireArray(100)
  t.deepEqual(arr.all(), [])
  t.end()
})

test('full', function (t) {
  var arr = ExpireArray(100)
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
  var arr = ExpireArray(100)
  arr.push(1)
  arr.push(2)
  var clone = arr.all()
  clone.shift()
  t.deepEqual(clone, [2])
  t.deepEqual(arr.all(), [1, 2])
  t.end()
})
