module.exports = {

	db: {
		url: 'adsb',
		collection: 'rawPackets'
	},

	apiKey: 'INSERT API KEY HERE',
	stateServerUrl: 'INSERT STATE SERVER URL HERE',

	location: {
		lat: 0,  // Dump1090 receiver lat
		lng: 0   // Dump1090 receiver lon
	}
};
