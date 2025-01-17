// Copyright 2014 Runtime.JS project authors
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

exports.wordBE = function(u8, offset) {
  return ((u8[offset] << 8) + u8[offset + 1]) >>> 0;
};

exports.dwordBE = function(u8, offset) {
  return ((u8[offset + 0] << 24) + (u8[offset + 1] << 16) +
          (u8[offset + 2] << 8)  +  u8[offset + 3]) >>> 0;
};
