var os = require('os');
var mongo = require('mongoskin');

var logMemory = function() {
	var now = new Date();
	this._db.insert({
		timestamp : now.getTime(),
		freeMemory : os.freemem(),
		usedMemory : process.memoryUsage()
	}, function() {
	});
};

var MemoryLogger = module.exports = function(opts) {
	opts = opts ? opts : {};
	if (!(this instanceof MemoryLogger)) {
		return new MemoryLogger(opts);
	}
	this._interval = opts.interval || 1;
	if (opts.db) {
		this.database(opts.db.address, opts.db.collection, opts.db.options);
	}else if (opts.mongo) {
		this.mongo(opts.mongo);
	}else {
		this.database('mongodb://localhost:27017/memory');
	}
};

MemoryLogger.prototype.start = function() {
	if (!this._timer) {
		this._timer = setInterval(logMemory.bind(this), this._interval * 1000);
		process.nextTick(logMemory.bind(this));
	}
};

MemoryLogger.prototype.stop = function() {
	clearInterval(this._timer);
};

MemoryLogger.prototype.mongo = function(db) {
	this._db = db;
	return this;
};

MemoryLogger.prototype.database = function(url, collection, options) {
	url = url || 'mongodb://localhost:27017/memory';
	collection = collection || 'memoryLog';
	options = options || {w: 0};
	if (!url.match(/^mongodb:\/\/.*/)) {
		url = 'mongodb://' + url;
	}

	this._db = mongo.db(url, options).collection(collection);
	return this;
};
