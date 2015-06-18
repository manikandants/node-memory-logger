var mongo = require('mongoskin');
var MemoryLogger = require('../index.js');

describe('MemoryLogger', function() {
	describe('new MemoryLogger()', function() {
		it('should create an instance of MemoryLogger', function() {
			var memoryLogger = MemoryLogger();
			expect(memoryLogger instanceof MemoryLogger).toBeTruthy();
		});
		it('should initialize MemoryLogger with default interval', function() {
			var memoryLogger = MemoryLogger();
			expect(memoryLogger._interval).toEqual(1);
		});
		it('should initialize the database with default db configuration', function() {
			var url = 'mongodb://localhost:27017/memory';
			var options = {w:0};
			var collection = 'memoryLog';
			var memoryLogger = MemoryLogger();
			expect(memoryLogger._db).toEqual(mongo.db(url, options).collection(collection));
		});
		it('should initialize the database with passed db configuration', function() {
			var url = 'mongodb://localhost:27017/memoryUnit';
			var options = {w:0};
			var collection = 'memoryLogUnit';
			var memoryLogger = MemoryLogger({
				db : {
					address : url,
					collection : collection,
					options : options
				}
			});
			expect(memoryLogger._db).toEqual(mongo.db(url, options).collection(collection));
		});
		it('should initialize the database with passed db configuration without complete url', function() {
			var url = 'localhost:27017/memoryUnit';
			var options = {w:0};
			var collection = 'memoryLogUnit';
			var memoryLogger = MemoryLogger({
				db : {
					address : url,
					collection : collection,
					options : options
				}
			});
			expect(memoryLogger._db).toEqual(mongo.db('mongodb://' + url, options).collection(collection));
		});
		it('should initialize the database with passed mongo object configuration', function() {
			var url = 'mongodb://localhost:27017/memoryUnit';
			var options = {w:0};
			var collection = 'memoryLogUnit';
			var mongoObject = mongo.db(url, options).collection(collection);
			var memoryLogger = MemoryLogger({mongo:mongoObject});
			expect(memoryLogger._db).toEqual(mongoObject);
		});
		it('should initialize MemoryLogger with passed interval', function() {
			var memoryLogger = MemoryLogger({interval : 5});
			expect(memoryLogger._interval).toEqual(5);
		});
		it('should initialize MemoryLogger with passed interval', function() {
			var memoryLogger = MemoryLogger({interval : 5});
			expect(memoryLogger._interval).toEqual(5);
		});
	});
	describe('MemoryLogger.start()', function() {
		it('should start logging the memory usage and availability', function(done) {
			var memoryLogger = MemoryLogger();
			memoryLogger.start();
			memoryLogger._db.count({}, function(error, count) {
				expect(count).not.toEqual(0);
				done();
			});
		});
	});
	describe('MemoryLogger.stop()', function() {
		it('should stop logging the memory usage and availability', function(done) {
			var memoryLogger = MemoryLogger();
			memoryLogger.stop();
			expect(memoryLogger._timer).toBeUndefined();
			memoryLogger._db.remove({}, function(){
				done();
			});
		});
	});
});
