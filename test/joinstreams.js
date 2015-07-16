var fs = require("fs");

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
});
