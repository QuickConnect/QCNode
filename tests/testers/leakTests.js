var assert = require('assert'),
globalKeys = [ 
  'ArrayBuffer',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'DataView',
  'DTRACE_NET_SERVER_CONNECTION',
  'DTRACE_NET_STREAM_END',
  'DTRACE_NET_SOCKET_READ',
  'DTRACE_NET_SOCKET_WRITE',
  'DTRACE_HTTP_SERVER_REQUEST',
  'DTRACE_HTTP_SERVER_RESPONSE',
  'DTRACE_HTTP_CLIENT_REQUEST',
  'DTRACE_HTTP_CLIENT_RESPONSE',
  'global',
  'process',
  'GLOBAL',
  'root',
  'Buffer',
  'setTimeout',
  'setInterval',
  'clearTimeout',
  'clearInterval',
  'setImmediate',
  'clearImmediate',
  'console' ]

module.exports.run = function(a,b,cbs){
    var qc = require('../../'),
    keys = Object.keys(global)
    
    assert.equal(keys.length, globalKeys.length)
    assert.deepEqual(keys, globalKeys)
    setImmediate(cbs.end)
}