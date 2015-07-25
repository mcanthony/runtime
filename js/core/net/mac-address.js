// Copyright 2014-2015 runtime.js project authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

function MACAddress(a, b, c, d, e, f) {
  this.a = (a & 0xff) >>> 0;
  this.b = (b & 0xff) >>> 0;
  this.c = (c & 0xff) >>> 0;
  this.d = (d & 0xff) >>> 0;
  this.e = (e & 0xff) >>> 0;
  this.f = (f & 0xff) >>> 0;
}

function valueString(x) {
  return (x < 0x10) ? '0' + x.toString(16) : x.toString(16);
}

MACAddress.prototype.toString = function() {
  return valueString(this.a) + ':' + valueString(this.b) + ':' +
         valueString(this.c) + ':' + valueString(this.d) + ':' +
         valueString(this.e) + ':' + valueString(this.f);
};

MACAddress.prototype.equals = function(that) {
  return this.a === that.a && this.b === that.b &&
         this.c === that.c && this.d === that.d &&
         this.e === that.e && this.f === that.f;
};

MACAddress.BROADCAST = new MACAddress(0xff, 0xff, 0xff, 0xff, 0xff, 0xff);
MACAddress.ZERO = new MACAddress(0, 0, 0, 0, 0, 0);

MACAddress.parse = function(str) {
  if (str instanceof MACAddress) {
    return str;
  }

  if ('string' !== typeof str) {
    return null;
  }

  var p = str.trim().split(':');
  if (6 !== p.length) {
    return null;
  }

  var a = new Array(6);
  for (var i = 0; i < 6; ++i) {
    var v = parseInt(p[i], 16) | 0;
    if (v !== parseInt(p[i], 16) || v < 0 || v > 255) {
      return null;
    }

    a[i] = v;
  }

  return new MACAddress(a[0], a[1], a[2], a[3], a[4], a[5]);
};

module.exports = MACAddress;
