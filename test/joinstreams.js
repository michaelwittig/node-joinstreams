var stream = require("stream");

var assert = require("assert-plus");
var streamify = require("stream-array");
var toArray = require("stream-to-array");

var index = require("../index.js");

describe("joinstreams", function() {
  "use strict";
  it("lib check", function(done) {
    var stream = streamify([1, 2, 3]);
    toArray(stream, function(err, arr) {
      assert.equal(err, null, "err");
      assert.deepEqual(arr, [1, 2, 3], "arr");
      done();
    });
  });
  it("one stream", function(done) {
    var streams = [
      streamify([1, 2, 3])
    ];
    toArray(index(streams), function(err, arr) {
      assert.equal(err, null, "err");
      assert.deepEqual(arr, [[1], [2], [3]], "arr");
      done();
    });
  });
  it("two stream", function(done) {
    var streams = [
      streamify([1, 2, 3]),
      streamify([10, 20, 30])
    ];
    toArray(index(streams), function(err, arr) {
      assert.equal(err, null, "err");
      assert.deepEqual(arr, [[1, 10], [2, 20], [3, 30]], "arr");
      done();
    });
  });
  it("three stream", function(done) {
    var streams = [
      streamify([1, 2, 3]),
      streamify([10, 20, 30]),
      streamify([100, 200, 300])
    ];
    toArray(index(streams), function(err, arr) {
      assert.equal(err, null, "err");
      assert.deepEqual(arr, [[1, 10, 100], [2, 20, 200], [3, 30, 300]], "arr");
      done();
    });
  });
  it("one fast and one slow stream", function(done) {
    var stream1 = new stream.Readable({objectMode: true});
    stream1._read = function(_size) {};
    var stream2 = new stream.Readable({objectMode: true});
    stream2._read = function(_size) {};
    var reads = 0;
    index([stream1, stream2])
      .on("data", function(data) {
        reads += 1;
      })
      .on("end", function() {
        assert.equal(reads, 3, "reads");
        done();
      });
    stream1.push(1);
    stream1.push(2);
    stream1.push(3);
    stream1.push(null);
    setTimeout(function() {
      stream2.push(10);
    }, 200);
    setTimeout(function() {
      stream2.push(20);
    }, 400);
    setTimeout(function() {
      stream2.push(30);
    }, 600);
    setTimeout(function() {
      stream2.push(null);
    }, 800);
  });
  it("one slow and one fast stream", function(done) {
    var stream1 = new stream.Readable({objectMode: true});
    stream1._read = function(_size) {};
    var stream2 = new stream.Readable({objectMode: true});
    stream2._read = function(_size) {};
    var reads = 0;
    index([stream2, stream1])
      .on("data", function(data) {
        reads += 1;
      })
      .on("end", function() {
        assert.equal(reads, 3, "reads");
        done();
      });
    stream1.push(1);
    stream1.push(2);
    stream1.push(3);
    stream1.push(null);
    setTimeout(function() {
      stream2.push(10);
    }, 200);
    setTimeout(function() {
      stream2.push(20);
    }, 400);
    setTimeout(function() {
      stream2.push(30);
    }, 600);
    setTimeout(function() {
      stream2.push(null);
    }, 800);
  });
});
