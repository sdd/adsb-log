const config      = require('./config'),
	//db          = require('mongojs').connect(config.db.url, [config.db.collection]),
	through2    = require('through2'),
	_           = require('lodash'),
	request     = require('request-promise');

module.exports = through2.obj(
	function(chunk, enc, cb) {

		const cbOnce = _.once(cb);

		try {
			//db[config.db.collection].save(chunk, function() {
			//	console.log('written');
			//	cbOnce();
			//});

			//console.log('POSTING: ' + JSON.stringify(chunk));

			const reqParams = {
				url: config.stateServerUrl,
				headers: { 'x-api-key': config.apiKey },
				json: true,
				method: 'POST',
				body: chunk
			};

			request(reqParams)
			.then(res => res === 'OK' ? null : res )
			.then(cbOnce)
			.catch(e => {
				console.error('Error saving to DB 1');
				console.error(e.message);
				cbOnce()
			});

		} catch (e) {
			console.error('Error saving to DB 2');
			console.error(e.messsage);
			cbOnce();
		}
	},
	function(cb) {
		try {
			//db.close();
		} catch (e) {
			console.error('Error Closing DB');
			console.error(e.message);
		} finally {
			cb();
		}
	}
);
