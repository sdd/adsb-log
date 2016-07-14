var net = require('net');
require('colors');

module.exports = net.connect(
	{ port: 30003 },
	() => console.log('Connected to Dump1090'.green)
);
