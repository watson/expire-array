'use strict'

var delay = 5 // ms delay to wait before scheduling a GC after an element should be cleared

var ExpireArray = module.exports = function (timeout) {
  if (!(this instanceof ExpireArray)) return new ExpireArray(timeout)
  if (!Number.isFinite(timeout)) throw new Error('Timeout must be a number')
  this._timeout = timeout
  this._db = []
}

ExpireArray.prototype._scheduleGC = function () {
  if (this._nextGC) return
  var ts = this._db.length ? this._db[0][0] - Date.now() + delay : this._timeout
  this._nextGC = setTimeout(this._gc.bind(this), ts)
  if (this._nextGC.unref) this._nextGC.unref()
}

ExpireArray.prototype._gc = function () {
  var now = Date.now()
  while (this._db.length && this._db[0][0] < now) {
    this._db.shift()
  }
  this._nextGC = null
  this._scheduleGC()
}

ExpireArray.prototype.push = function (elm) {
  if (!this._db.length) this._scheduleGC()
  this._db.push([Date.now() + this._timeout, elm])
}

ExpireArray.prototype.pop = function () {
  var elm = this._db.pop()
  if (!this._db.length && this._nextGC) {
    clearTimeout(this._nextGC)
    this._nextGC = null
  }
  return elm && elm[1]
}

ExpireArray.prototype.shift = function () {
  var elm = this._db.shift()
  if (this._nextGC) {
    clearTimeout(this._nextGC)
    this._nextGC = null
  }
  this._scheduleGC()
  return elm && elm[1]
}

ExpireArray.prototype.all = function () {
  return this._db.map(function (elm) {
    return elm[1]
  })
}

/**
 * forwarded functions
 */

ExpireArray.prototype.every = function (fn, self) {
  return this._db.every(function (elm, index) {
    return fn.call(self, elm[1], index)
  })
}

ExpireArray.prototype.forEach = function (fn, self) {
  this._db.forEach(function (elm, index) {
    fn.call(self, elm[1], index)
  })
}

ExpireArray.prototype.map = function (fn, self) {
  return this._db.map(function (elm, index) {
    return fn.call(self, elm[1], index)
  })
}

ExpireArray.prototype.some = function (fn, self) {
  return this._db.some(function (elm, index) {
    return fn.call(self, elm[1], index)
  })
}
