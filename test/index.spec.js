var MemoryLogger = require('../index.js');

var memoryLogger = MemoryLogger({
	db : {
		address : 'mongodb://localhost:27017/memory',
		collection : 'memoryLog'
	},
	interval : 10
});
memoryLogger.start();
