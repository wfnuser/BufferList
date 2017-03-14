'use strict';

var RuffBufferList = function BufferList() {
    var idx = 0;
    this.arr = [];
    this.length = this.arr.length;
};

RuffBufferList.prototype.__get_index__ = function (i) {
    return i;
};

RuffBufferList.prototype.__put_index__ = function (i, value) {
    console.log(i, value);
};

RuffBufferList.prototype.slice = function (start, end) {
    var tmp = new Buffer('');
    if (start === null || start === undefined) {
        start = 0;
    }
    if (end === null || end === undefined) {
        end = this.length;
    }
    this.arr.some(function (element) {
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

RuffBufferList.prototype.copy = function (dst, dstStart, srcStart, srcEnd) {
    var tmp = this.slice(srcStart, srcEnd);
    tmp.copy(dst, dstStart);
    return dst;
};

RuffBufferList.prototype.consume = function (bytes) {
    while (this.arr.length) {
        if (bytes >= this.arr[0].length) {
            bytes -= this.arr[0].length;
            this.length -= this.arr[0].length; 
            this.arr.shift();
        } else {
            this.arr[0] = this.arr[0].slice(bytes);
            this.length -= bytes;
            break;
        }
    }
    return this;
};

RuffBufferList.prototype.getArray = function () {
    return this.arr;
};

RuffBufferList.prototype.append = function (val) {
    // if (typeof(val) == "Buffer") {
    this.arr.push(val);
    // }
    this.length += val.length;
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
bl.append(Buffer.from('456'));
bl.append(Buffer.from('789'));

console.log(bl[0]);

module.exports = RuffBufferList;
