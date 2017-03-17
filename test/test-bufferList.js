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

// single buffer
function genBlWithAscBuffer () {
    var bl = new BufferList();
    var b = Buffer.alloc(0x100);
    for (var i = 0; i < 0x100; i++) {
        b[i]=i;
    }
    bl.append(b);
    return bl;
}

// buffer chunks
function genBlWithChunks () {
    var bl = new BufferList();
    for (var i = 0; i < 0x100; i++) {
        bl.append(Buffer.alloc(1,i));
    }
    return bl;
}

// buffer chunks in ascend size
function genBlWithChunksInDiffSize () {
    var bl = new BufferList();
    var i = 0;
    var j = 0;
    var size = 1;
    while (i < 0x100) {
        if (size + i >= 0x100) size = 0x100 - i;
        var b = Buffer.alloc(size);
        for (j = i; j < size + i; j++) {
            b[j-i] = j;
        }
        i = j;
        bl.append(b);
        size++;
    }
    return bl;
}

// buffer chunks to test KMP
function genBlToTestKMP () {
    var bl = new BufferList();
    for (var i = 0; i < 2; i++) {
        bl.append(Buffer.alloc(1,2));
        bl.append(Buffer.alloc(199,1));
    }
    bl.append(Buffer.alloc(1,1));
    return bl;
}		

describe('test buffer list', function () {
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

    it('should append', function (done) {
        var bl = genBlWithChunks();
        if (bl.length !== 0x100)
            done(new Error());
        done();
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
    it('should read buffer', function (done) {
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

    it('should indexOf for buffer chunks', function (done) {

        var bl = genBlWithChunks();
        for (var i = 0; i < 0x100; i++) {
            if (bl.indexOf3(i) !== i) {
                done(new Error());
                return;
            }
        }

        done();
    });
    it('should indexOf for single buffer', function (done) {
        
        var bl = genBlWithAscBuffer();
        for (var i = 0; i < 0x100; i++) {
            if (bl.indexOf2(i) !== i) {
                done(new Error());
                return;
            }
        }

        done();
    });
    it('should indexOf for buffer in different size', function (done) {
        
        var bl = genBlWithChunksInDiffSize();
        for (var i = 0; i < 0x100; i++) {
            if (bl.indexOf(i) !== i) {
                done(new Error());
                return;
            }
        }

        done();
    });
    it('should indexOf for buffer to test KMP', function (done) {
        var bl = genBlToTestKMP();
        var tic, toc;
        tic = Date.now();
        console.log(bl.indexOf(Buffer.alloc(200,1)));
        toc = Date.now();
        console.log(toc - tic);
        tic = Date.now();
        console.log(bl.indexOf2(Buffer.alloc(200,1)));
        toc = Date.now();
        console.log(toc - tic);
        tic = Date.now();
        console.log(bl.indexOf3(Buffer.alloc(200,1)));
        toc = Date.now();
        console.log(toc - tic);
        done();
    });

    it('should get for single buffer', function (done) {
        var bl = genBlWithAscBuffer();
        for (var i = 0; i < 0x100; i++) {
            if (bl.__get_index__(i) !== i)
                done(new Error());
        }

        done();
    });

    it('should put for buffer chunks', function (done) {
        var bl = genBlWithChunks();
        for (var i = 0; i < 0x100; i++) {
            bl.__put_index__(i, (0xff-i));
            if (bl.__get_index__(i) !== 0xff-i)
                done(new Error());
        }

        done();
    });

    it('should put for single buffer', function (done) {
        var bl = genBlWithAscBuffer();
        for (var i = 0; i < 0x100; i++) {
            bl.__put_index__(i, 0xff-i);
            if (bl.__get_index__(i) !== 0xff-i)
                done(new Error());
        }

        done();
    });

});
