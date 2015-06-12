var os = require('os');
var mongo = require('mongoskin');

var MemoryLogger = module.exports = function(opts) {
	opts = opts ? opts : {};
	if (!(this instanceof MemoryLogger)) {
		return new MemoryLogger(opts);
	}
	this._interval = opts.interval || 1;
	if (opts.db) {
		this.database(opts.db.address, opts.db.collection, opts.db.options);
	}else if (opts.mongo) {
		this._db = mongo.db;
	}else {
		this.database('mongodb://localhost:27017/memory');
	}
};

MemoryLogger.prototype.start = function() {
	if (!this._callback) {
		this._callback = setInterval(logMemory.bind(this), this._interval * 1000);
		process.nextTick(logMemory.bind(this));
	}
};

MemoryLogger.prototype.mongo = function(db) {
	this._db = db;
	return this;
};

MemoryLogger.prototype.database = function(url, collection, options) {
	collection = collection || 'memoryLog';
	options = options || {w: 0};
	if (!url.match(/^mongodb:\/\/.*/)) {
		url = 'mongodb://' + url;
	}

	this._db = mongo.db(url, options).collection(collection);
	return this;
};

var logMemory = function() {
	this._db.insert({
		freeMemory : os.freemem(),
		usedMemory : process.memoryUsage()
	}, function(error, savedMem) {
	});
};
