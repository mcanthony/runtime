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
var IP4Address = require('./ip4-address');
var checksum = require('./checksum');
var u8view = require('u8-view');
var minHeaderLength = 20;

var nextId = 1;

exports.PROTOCOL_ICMP = 0x01;
exports.PROTOCOL_TCP = 0x06;
exports.PROTOCOL_UDP = 0x11;

exports.getSrcIP = function(u8, headerOffset) {
  return new IP4Address(u8[headerOffset + 12],
                        u8[headerOffset + 13],
                        u8[headerOffset + 14],
                        u8[headerOffset + 15]);
};

exports.getDestIP = function(u8, headerOffset) {
  return new IP4Address(u8[headerOffset + 16],
                        u8[headerOffset + 17],
                        u8[headerOffset + 18],
                        u8[headerOffset + 19]);
};

exports.getProtocolId = function(u8, headerOffset) {
  return u8[headerOffset + 9];
};

exports.getHeaderLength = function(u8, headerOffset) {
  return (u8[headerOffset] & 0xf) << 2;
};

exports.getFragmentationData = function(u8, headerOffset) {
  return u8view.getUint16BE(u8, headerOffset + 6);
};

exports.getIdentification = function(u8, headerOffset) {
  return u8view.getUint16BE(u8, headerOffset + 4);
};

exports.fragmentationDataIsMoreFragments = function(value) {
  return !!((value >>> 13) & 0x1);
};

exports.fragmentationDataIsDontFragment = function(value) {
  return !!((value >>> 14) & 0x1);
};

exports.fragmentationDataOffset = function(value) {
  return (value & 0x1fff) * 8;
};

exports.minHeaderLength = minHeaderLength;

exports.write = function(u8, headerOffset, protocolId, srcIP, destIP, packetLength) {
  var version = 4; // IPv4
  var IHL = minHeaderLength >>> 2;
  var byte0 = ((version << 4) | IHL) >>> 0;

  u8[headerOffset] = byte0;
  u8[headerOffset + 1] = 0; // ToS
  u8view.setUint16BE(u8, headerOffset + 2, packetLength);
  u8view.setUint16BE(u8, headerOffset + 4, ++nextId); // ID
  u8view.setUint16BE(u8, headerOffset + 6, 0); // No fragmantation
  u8[headerOffset + 8] = 64; // TTL
  u8[headerOffset + 9] = protocolId; // Protocol ID
  u8view.setUint16BE(u8, headerOffset + 10, 0); // Checksum 0
  u8[headerOffset + 12] = srcIP.a;
  u8[headerOffset + 13] = srcIP.b;
  u8[headerOffset + 14] = srcIP.c;
  u8[headerOffset + 15] = srcIP.d;
  u8[headerOffset + 16] = destIP.a;
  u8[headerOffset + 17] = destIP.b;
  u8[headerOffset + 18] = destIP.c;
  u8[headerOffset + 19] = destIP.d;
  u8view.setUint16BE(u8, headerOffset + 10, checksum(u8, headerOffset, minHeaderLength, 0));
};
