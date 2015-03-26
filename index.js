'use strict'

var delay = 5 // ms delay to wait before scheduling a GC after an element should be cleared

var ExpireArray = module.exports = function (timeout) {
  if (!(this instanceof ExpireArray)) return new ExpireArray(timeout)
  if (!Number.isFinite(timeout)) throw new Error('Timeout must be a number')
  this._timeout = timeout
  this._db = []
}

ExpireArray.prototype._scheduleGC = function (wait) {
  if (this._nextGC) return
  wait = wait === undefined ? this._timeout : wait
  this._nextGC = setTimeout(this._gc.bind(this), wait)
}

ExpireArray.prototype._gc = function () {
  var now = Date.now()
  while (this._db.length && this._db[0][0] < now) {
    this._db.shift()
  }
  this._nextGC = null
  if (this._db.length) this._scheduleGC(this._db[0][0] - Date.now() + delay)
}

ExpireArray.prototype.push = function (elm) {
  var ts = Date.now() + this._timeout
  if (!this._db.length) this._scheduleGC()
  this._db.push([ts, elm])
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
