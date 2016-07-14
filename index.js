const dump1090Connection  = require('./dump1090Connection'),
	  packetSplitter      = require('./packetSplitter'),
	  entryCreator        = require('./entryCreator'),
	  dbWriter            = require('./dbWriter');

dump1090Connection
	.pipe(packetSplitter)
	.pipe(entryCreator)
	.pipe(dbWriter);
