var BufferList = require('../BufferList');

require('t');

var bl = new BufferList();
bl.append(Buffer.from('123'));
bl.append(Buffer.from('456'));
bl.append(Buffer.from('789'));

var slicebl1 = bl.slice(0,2);
var slicebl2 = bl.slice(0,4);
var slicebl3 = bl.slice(2);

var copy = Buffer.from('!!!!!!!!!!!!!!!!!!!!!');
var copybl1 = bl.copy(copy,3,5,7);

var consumebl1 = bl;

var result1 = Buffer.from('12');
var result2 = Buffer.from('1234');
var result3 = Buffer.from('3456789');
var result4 = Buffer.from('!!!67!!!!!!!!!!!!!!!!');
						
describe('test parser', function () {
    it('should slice bufferList range in each item', function (done) {
        if (slicebl1.toString() === result1.toString())
            done();
    });
    it('should slice bufferList range from items', function (done) {
        if (slicebl2.toString() === result2.toString())
            done();
    });
    it('should slice with default parameter', function (done) {
        if (slicebl3.toString() === result3.toString())
            done();
        else 
            done(new Error());
    });

    it('should copy', function (done) {
        if (copybl1.toString() === result4.toString())
            done();
        else 
            done(new Error());
    });

    it('should consume', function (done) {
        consumebl1.consume(2);
        if (consumebl1.getArray().toString() != "3,456,789")
            done(new Error());
        consumebl1.consume(2);
        if (consumebl1.getArray().toString() != "56,789")
            done(new Error());
        done();
    });

    it('should read', function (done) {
        var bl = new BufferList();
        bl.append(Buffer.from('123'));
        bl.append(Buffer.from('456'));
        bl.append(Buffer.from('789'));
        if (bl.readUInt16BE(5) != 13879)
            done(new Error());
        if (bl.readUInt16LE(5) != 14134)
            done(new Error());
        if (bl.readInt8(5) != 54)
            done(new Error());
        if (bl.readUInt32BE(5) != 909588537)
            done(new Error());
        done();
    });

    it('should get by index', function (done) {
        var bl = new BufferList();
        bl.append(Buffer.from('123'));
        bl.append(Buffer.from('456'));
        bl.append(Buffer.from('789'));

        if (bl.readUInt16BE(5) != 13879)
            done(new Error());
        if (bl.readUInt16LE(5) != 14134)
            done(new Error());
        if (bl.readInt8(5) != 54)
            done(new Error());
        if (bl.readUInt32BE(5) != 909588537)
            done(new Error());
        done();
    });

    it('should return index of string', function (done) {
        var bl = new BufferList();
        bl.append(Buffer.from('123'));
        bl.append(Buffer.from('456'));
        bl.append(Buffer.from('789'));
        
        if (bl.indexOf(1) != 0)
            done(new Error());
        if (bl.indexOf("12") != 0)
            done(new Error());
        if (bl.indexOf("34567") != 2)
            done(new Error());
        if (bl.indexOf("13") != -1)
            done(new Error());
        done();
    });
});
