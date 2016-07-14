const _           = require('lodash'),
	  through2    = require('through2');
let	  buffer      = '';

module.exports = through2.obj(function(chunk, enc, cb) {

	try {
		buffer += chunk.toString();
		const packets = buffer.split('\n');
		buffer = _.last(packets);

		_.each(
			_.filter(_.dropRight(packets), packet => !!packet.length),
			this.push,
			this
		);
	} catch (e) {
		console.error('packet splitter error:');
		console.error(e);
		console.error(e.stack);
	} finally {
		cb();
	}
});
