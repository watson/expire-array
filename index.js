'use strict'

var delay = 5 // ms delay to wait before scheduling a GC after an element should be cleared

var ExpireArray = module.exports = function (timeout) {
  if (!(this instanceof ExpireArray)) return new ExpireArray(timeout)
  if (!Number.isFinite(timeout)) throw new Error('Timeout must be a number')
  this.timeout = timeout
  this.db = []
}

ExpireArray.prototype._scheduleGC = function (wait) {
  if (this._nextGC) return
  wait = wait === undefined ? this.timeout : wait
  this._nextGC = setTimeout(this._gc.bind(this), wait)
}

ExpireArray.prototype._gc = function () {
  var now = Date.now()
  while (this.db.length && this.db[0][0] < now) {
    this.db.shift()
  }
  this._nextGC = null
  if (this.db.length) this._scheduleGC(this.db[0][0] - Date.now() + delay)
}

ExpireArray.prototype.push = function (elm) {
  var ts = Date.now() + this.timeout
  if (!this.db.length) this._scheduleGC()
  this.db.push([ts, elm])
}

ExpireArray.prototype.all = function () {
  return this.db.map(function (elm) {
    return elm[1]
  })
}

/**
 * forwarded functions
 */

ExpireArray.prototype.every = function (fn, self) {
  return this.db.every(function (elm, index) {
    return fn.call(self, elm[1], index)
  })
}

ExpireArray.prototype.forEach = function (fn, self) {
  this.db.forEach(function (elm, index) {
    fn.call(self, elm[1], index)
  })
}

ExpireArray.prototype.map = function (fn, self) {
  return this.db.map(function (elm, index) {
    return fn.call(self, elm[1], index)
  })
}

ExpireArray.prototype.some = function (fn, self) {
  return this.db.some(function (elm, index) {
    return fn.call(self, elm[1], index)
  })
}
