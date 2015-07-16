[![Build Status](https://secure.travis-ci.org/michaelwittig/node-joinstreams.png)](http://travis-ci.org/michaelwittig/node-joinstreams)
[![NPM version](https://badge.fury.io/js/joinstreams.png)](http://badge.fury.io/js/joinstreams)
[![NPM dependencies](https://david-dm.org/michaelwittig/joinstreams.png)](https://david-dm.org/michaelwittig/joinstreams)

# joinstreams

join (or zip) multiple readable streams on object mode together.

  var joinstreams = require("joinstreams");

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

will print

  data [ 1, 10 ]
  data [ 2, 20 ]
  data [ 3, 30 ]
  end
