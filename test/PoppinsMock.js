var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function PoppinsMock () {
  EventEmitter.call(this);
}

util.inherits(PoppinsMock, EventEmitter);

PoppinsMock.prototype.config = {
  asana: {
    workspace: 1,
    project: 1,
    apiKey: 'foobar'
  }
};

module.exports = PoppinsMock;
