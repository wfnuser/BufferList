'use strict';

var RuffBufferList = function BufferList() {
    var that = this;
    var idx = 0;
    var arr = [];
    this.length = arr.length;
    this.append = function (val) {
        // if (typeof(val) == "Buffer") {
        arr.push(val);
        // }
        this.length += val.length;
    };
    this.slice = function (start, end) {
        var tmp = new Buffer('');
        if (start === null || start === undefined) {
            start = 0;
        }
        if (end === null || end === undefined) {
            end = that.length;
        }
        arr.some(function (element) {
            if (start > element.length - 1) {
                start -= element.length;
                end -= element.length;
            }
            else {
                if (end > element.length) {
                    tmp = Buffer.concat([tmp, element.slice(start)]);
                    start = 0;
                }
                else {
                    tmp = Buffer.concat([tmp, element.slice(start, end)]);
                    return true;
                }
                end -= element.length;
            }
        }, this);
        return tmp;
    };
    this.copy = function (dest, destStart, srcStart, srcEnd) {
    }
    this.readFloatBE = function (offset) {
        var tmp = this.slice(offset, offset + 1);

    }
    this.getArray = function () {
        return arr;
    };
};

RuffBufferList.prototype.__get_index__ = function (i) {
    return i;
};

RuffBufferList.prototype.__put_index__ = function (i, value) {
    console.log(i, value);
};

(function () {
  var methods = {
      'readDoubleBE' : 8
    , 'readDoubleLE' : 8
    , 'readFloatBE'  : 4
    , 'readFloatLE'  : 4
    , 'readInt32BE'  : 4
    , 'readInt32LE'  : 4
    , 'readUInt32BE' : 4
    , 'readUInt32LE' : 4
    , 'readInt16BE'  : 2
    , 'readInt16LE'  : 2
    , 'readUInt16BE' : 2
    , 'readUInt16LE' : 2
    , 'readInt8'     : 1
    , 'readUInt8'    : 1
  }

  for (var m in methods) {
    (function (m) {
      RuffBufferList.prototype[m] = function (offset) {
        return this.slice(offset, offset + methods[m])[m](0)
      }
    }(m))
  }
}())



var bl = new RuffBufferList();

bl.append(Buffer.from('123'));
console.log(bl.length);
bl.append(Buffer.from('456'));
bl.append(Buffer.from('789'));
bl.append(Buffer.from('123123'));
console.log(bl.length);
console.log(bl.getArray());
console.log(bl.slice());
console.log(bl.readDoubleBE(2));


exports.BufferList = RuffBufferList;
