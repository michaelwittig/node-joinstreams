var util = require("util");
var stream = require("stream");

var READ_HIGH_WATER_MARK = 1024;

function ReadableJoinedStream(streams) {
  "use strict";
  stream.Readable.call(this, {objectMode: true, highWaterMark: READ_HIGH_WATER_MARK});
  this.__streams = streams; // readable streams
  this.__readables = streams.length; // number of readable streams
  this.__readable = 0; // number of streams signaled "readable"
  this.__read = []; // current read, will contain this.__readables.length elements when done with a "line"
  this.__reading = 0; // stream index we are reading from
  this.__fetching = false; // are we in the process of fetching data from the streams?
  this.__end = streams.map(function() {return false;});
  var self = this;
  var ended = 0;
  streams.forEach(function(stream, streamIndex) {
    stream.on("readable", function() {
      self.__readable += 1;
      if (self.__readable === self.__readables) {
        self.__fetch();
      }
    });
    stream.once("end", function() { // we assume that all streams are of equal length
      self.__end[streamIndex] = true;
      ended += 1;
      if (ended === self.__readables) {
        self.push(null);
      }
    });
  });
}
util.inherits(ReadableJoinedStream, stream.Readable);
ReadableJoinedStream.prototype.__fetch = function() {
  "use strict";
  if (this.__fetching === true) { // prevent multiple fetches
    return;
  }
  this.__fetching = true;
  while(true) {
    while (this.__reading < this.__readables) {
      var read = this.__streams[this.__reading].read();
      if (read === null) { // nothing to read or end of stream?
        if (this.__end[this.__reading] === false) { // if end of stream is reached continue with the other streams to also end them
          this.__readable -= 1;
          this.__fetching = false;
          return;
        }
      }
      this.__read.push(read);
      this.__reading += 1;
    }
    var cont = this.push(this.__read);
    this.__read = [];
    this.__reading = 0;
    if (cont === false) { // buffer is full, we need to stop for a while
      this.__fetching = false;
      return;
    }
  }
  this.__fetching = false;
};
ReadableJoinedStream.prototype._read = function(_size) {
  "use strict";
  if (this.__readable === this.__readables) {
    this.__fetch();
  }
};

module.exports = function(streams) {
  "use strict";
  return new ReadableJoinedStream(streams);
};
