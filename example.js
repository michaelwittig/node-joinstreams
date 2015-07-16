var joinstreams = require("./index.js");
var stream = require("stream");

var stream1 = new stream.Readable({objectMode: true});
var stream2 = new stream.Readable({objectMode: true});

joinstreams([stream1, stream2])
  .on("data", function(data) {
    "use strict";
    console.log("data", data);
  })
  .on("end", function() {
    "use strict";
    console.log("end");
  });

stream1.push(1);
stream1.push(2);
stream1.push(3);
stream1.push(null);

stream2.push(10);
stream2.push(20);
stream2.push(30);
stream2.push(null);
