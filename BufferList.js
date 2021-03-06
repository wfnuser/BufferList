'use strict';

var RuffBufferList = function BufferList() {
    this.length = 0;
    this.arr = [];
};
var p = [];

RuffBufferList.prototype.__get_index__ = function (i) {
    var tmp;
    for (var idx = 0; idx < this.arr.length; idx++) {
        if (i < this.arr[idx].length) {
            tmp = this.arr[idx][i];
            break;
        }
        i -= this.arr[idx].length;
    };
    return tmp;
};

RuffBufferList.prototype.__put_index__ = function (i, value) {
    for (var idx = 0; idx < this.arr.length; idx++) {
        if (i < this.arr[idx].length) {
            this.arr[idx].writeUInt8(value,i);
            break;
        }
        i -= this.arr[idx].length;
    };
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

RuffBufferList.prototype.readInt8 = function (offset) {
    return this.__get_index__(offset);
};

RuffBufferList.prototype.readUInt8 = function (offset) {
    return this.__get_index__(offset);
};


RuffBufferList.prototype.indexOf = function (dst) {
    var buf;
    var result = -1;
    try {
        var len;
        if (dst.length === undefined) len = 1;
        else len = dst.length;
        if (dst instanceof Buffer)
            buf = dst;
        else
            buf = Buffer.alloc(len, dst);
    } catch (e) {
        throw new Error("indexOf arguments illegal");
    }
    //KMP to get better efficiency
    var j = -1;
    p[0] = -1;
    for (i = 1; i < this.length; i++) {
        while (j > -1 && this.__get_index__(j+1) !== this.__get_index__(i)) {j = p[j];}
        if (this.__get_index__(j+1) === this.__get_index__(i)) j++;
        p[i] = j;
    }
    j = -1;
    for (var i = 0; i < this.length; i++) {
        while(j > -1 && buf[j+1] !== this.__get_index__(i)) {j = p[j];}
        if (buf[j+1] === this.__get_index__(i)) {j = j + 1;}
        if (j >= buf.length - 1) {
            result = i - buf.length + 1;
            break;
        }
    }
    return result;
};

RuffBufferList.prototype.indexOf3 = function (dst) {
    var buf;
    var result = -1;
    try {
        var len;
        if (dst.length === undefined) len = 1;
        else len = dst.length;
        if (dst instanceof Buffer)
            buf = dst;
        else
            buf = Buffer.alloc(len, dst);
    } catch (e) {
        throw new Error("indexOf arguments illegal");
    }
    for (var i = 0; i < this.length; i++) {
        var offset = 0;
        while (this.__get_index__(offset + i) == buf[offset]) {
            offset++;
            if (offset >= buf.length) {
                result = i;
                break;
            };
        };
    }
    return result;
};

RuffBufferList.prototype.indexOf2 = function (dst) {
    var buf;
    try {
        var len;
        if (dst.length === undefined) len = 1;
        else len = dst.length;
        if (dst instanceof Buffer)
            buf = dst;
        else
            buf = Buffer.alloc(len, dst);
    } catch (e) {
        throw new Error("indexOf arguments illegal");
    }
    if (buf.length > this.length) {
        return -1;
    }
    var index = 0;
    var found = false;
    for (var i = 0; i < this.arr.length; i++) {
        var tmp = Buffer.alloc(0);
        var offset = 0;
        while (tmp.length < buf.length + this.arr[i].length) {
            if (i + offset >= this.arr.length) {
                break;
            }
            tmp = Buffer.concat([tmp, this.arr[i + offset]]);
            offset++;
        }
        if (tmp.length < buf.length) {
            break;
        }
        if (tmp.indexOf(buf) !== -1) {
            index += tmp.indexOf(buf);
            found = true;
            break;
        } else {
            index += this.arr[i].length;
        }
    }
    if (found) {
        return index;
    }
    else {
        return -1;
    }
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
  }

  for (var m in methods) {
    (function (m) {
      RuffBufferList.prototype[m] = function (offset) {
        return this.slice(offset, offset + methods[m])[m](0)
      }
    }(m))
  }
}())

module.exports = RuffBufferList;
