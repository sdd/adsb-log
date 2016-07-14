const through2 = require('through2'),
  	  location = require('./config').location,
      yargs    = require('yargs').argv,
	  sbs1     = require('sbs1');
require('colors');

module.exports = through2.obj(function(raw, enc, cb) {

	try {
        yargs.raw && console.log(`RAW: "${raw.toString()}"`);
		const message = sbs1.parseSbs1Message(raw.toString());

		let messageString = `${Date.now()} #${message.hex_ident}: `;
		switch(message.transmission_type) {
			case 1:
				messageString += `Callsign ${message.callsign}`;
				break;

			case 2:
				messageString += `Ground Pos - Lat ${message.lat}, Lon ${message.lon}`;
                message.interesting = true;
				break;

			case 3:
				messageString += `Alt ${message.altitude} ft, Lat ${message.lat}, Lon ${message.lon}`;
				break;

			case 4:
				messageString += `G Speed ${message.ground_speed} kts, Climb ${message.vertical_rate} ft/min, track ${message.track} deg`;
				break;

			case 5:
				if (message.callsign) {
					messageString += `Callsign ${message.callsign} `;
				}
				messageString += `Alt ${message.altitude} ft`;
				break;

			case 6:
				messageString += `Squawking ${message.squawk}`;
				switch (message.squawk) {
					case '0000':
						messageString += ' MODE S FAILURE';
						message.interesting = true;
						break;

					case '0033':
						messageString += ' PARACHUTE DROP IN PROGRESS';
						message.interesting = true;
						break;

					case '2000':
						messageString += ' ENTERING SSR AREA';
						message.interesting = true;
						break;

					case '7000':
						messageString += ' GENERAL CONSPICUOUS SQUAWK';
						message.interesting = true;
						break;

					case '7001':
						messageString += ' MILITARY CLIMBOUT';
						message.interesting = true;
						break;

					case '7004':
						messageString += ' AEROBATICS / DISPLAY';
						message.interesting = true;
						break;

					case '7500':
						messageString += ' HIJACKING';
						message.interesting = true;
						break;

					case '7600':
						messageString += ' RADIO FAILURE';
						message.interesting = true;
						break;

					case '7700':
						messageString += ' EMERGENCY';
						message.interesting = true;
						break;

					default:
						break;
				}
				break;

			case 7:
				messageString += `Air-to-air: Alt ${message.altitude} ft`;
				break;

			case 8:
				messageString += `(All call reply - Ident Only)`;
                message.boring = true;
				break;

			default:
				messageString += `UNKNOWN MESSAGE TYPE`;
				message.interesting = true;
				break;
		}

		if (message.squawk == 7700 || message.squawk == 7500 || message.emergency) {
			console.log(messageString.red);
            console.log(raw.toString().red);
            console.log(JSON.stringify(message).red);
        } else if (message.squawk == 7600 || message.alert) {
			console.log(messageString.yellow);
            console.log(raw.toString().yellow);
            console.log(JSON.stringify(message).yellow);
        } else if (message.interesting) {
			console.log(messageString.green);
            console.log(raw.toString().green);
            console.log(JSON.stringify(message).green);
        } else if (!message.boring && !yargs.interesting) {
			console.log(messageString.grey);
            yargs.boring && console.log(JSON.stringify(message).white);
        } else if (yargs.boring) {
            console.log(messageString.grey);
            console.log(JSON.stringify(message).white);
        }

		this.push({ message, location, received: new Date() });

	} catch (e) {
		console.error('Error creating entry');
		console.log(e);

	} finally {
		cb();
	}
});
