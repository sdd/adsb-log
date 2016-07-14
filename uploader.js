const config      = require('./config'),
	  request     = require('request-promise'),
      through2    = require('through2'),
      _           = require('lodash');

module.exports = through2.obj(
	function(chunk, enc, cb) {

		const cbOnce = _.once(cb);

		try {

			request({
				url: config.stateServerUrl,
				qs: { apiKey: config.apiKey },
				json: true,
				method: 'POST',
				body: formattedPacket
			})
			.then(result => console.log('request result: ' + result) && result)
			.then(cbOnce);

		} catch (e) {
			console.error('Error saving to DB');
			console.error(e);
			cbOnce();
		}
	},
	function(cb) {
		try {
			db.close();
		} catch (e) {
			console.error('Error Closing DB');
			console.error(e);
		} finally {
			cb();
		}
	}
);
