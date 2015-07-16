var util = require("util");
var stream = require("stream");

var assert = require("assert-plus");

var index = require("../index.js");

function NumberStream(n) {
  "use strict";
  stream.Readable.call(this, {objectMode: true});
  this.__n = n;
  this.__i = 0;
}
util.inherits(NumberStream, stream.Readable);
NumberStream.prototype._read = function(_size) {
  "use strict";
  if (this.__i < this.__n) {  
    this.push(this.__i);
    this.__i += 1;
  } else {
    this.push(null);
  }
};

describe("perf", function() {
  "use strict";
  var desired = 10 * 1000 * 1000;
  it("read many items from one stream", function(done) {
    var reads = 0;
    index([new NumberStream(desired)])
      .on("data", function(data) {
        reads += 1;
      })
      .on("end", function() {
        assert.equal(reads, desired, "reads");
        done();
      });
  });
  it("read many items from two streams", function(done) {
    var reads = 0;
    index([new NumberStream(desired), new NumberStream(desired)])
      .on("data", function(data) {
        reads += 1;
      })
      .on("end", function() {
        assert.equal(reads, desired, "reads");
        done();
      });
  });
  it("read many items from three streams", function(done) {
    var reads = 0;
    index([new NumberStream(desired), new NumberStream(desired), new NumberStream(desired)])
      .on("data", function(data) {
        reads += 1;
      })
      .on("end", function() {
        assert.equal(reads, desired, "reads");
        done();
      });
  });
  it("read many items from four streams", function(done) {
    var reads = 0;
    index([new NumberStream(desired), new NumberStream(desired), new NumberStream(desired), new NumberStream(desired)])
      .on("data", function(data) {
        reads += 1;
      })
      .on("end", function() {
        assert.equal(reads, desired, "reads");
        done();
      });
  });
});
