var events = require('events')
	util = require('util')

function QuickConnectStack(id, funcs, data, qc, cb, testing) {
	events.EventEmitter.call(this)
	
	var ValCFs, DCFs, VCFs, self = this,
	state = { going: false, cfIndex: -1, waitingCallback: null }
	
	this.id = id
	cb?this.on('ended', cb):''
	
	function go() {
	  if (state.going) {
	    throw new Error("Stack is already started")
	  }
//		console.log('go!')
		state.going = true
		
		self.emit('started', data)
		dispatch()
	}
	this.go = go
	
	ValCFs = funcs.validationMapConsumables[id].slice()
	DCFs = funcs.dataMapConsumables[id].slice()
	VCFs = funcs.viewMapConsumables[id].slice()
	
	function dispatch() {
	  var callback = testing?testingCallback:defaultCallback
	  if (ValCFs.length > 0) {
	    if (ValCFs.length == 1){
	      callback = testing?ValCFsDoneTestingCallback:ValCFsDoneCallback
	    }
	    dispatchToValCF(callback)
	  } else if (DCFs.length > 0) {
	    if (DCFs.length == 1){
	      callback = testing?ValCFsDoneTestingCallback:DCFsDoneCallback
	    }
	    dispatchToDCF(callback)
	  } else if (VCFs.length > 0) {
	    if (VCFs.length == 1){
	      callback = testing?VCFsDoneTestingCallback:VCFsDoneCallback
	    }
	    dispatchToVCF(callback)
	  } else {
	    selfDestruct()
	  }
	}
	
	function dispatchToValCF(callback) {
	  var func = ValCFs.shift()
	  dispatchToCF("ValCF", func, callback)
	}
	function dispatchToDCF(callback) {
	  var func = DCFs.shift()
	  dispatchToCF("DCF", func, callback)
	}
	function dispatchToVCF(callback) {
	  var func = VCFs.shift()
	  dispatchToCF("VCF", func, callback)
	}
	
	function newStackObject() {
	  return {
	    "asyncStackContinue":asyncStackContinue,
      "asyncStackExit":asyncStackExit,
      "asyncStackError":asyncStackError,
      "WAIT_FOR_DATA":qc.WAIT_FOR_DATA,
      "STACK_CONTINUE":qc.STACK_CONTINUE,
      "STACK_EXIT":qc.STACK_EXIT,
      "handleRequest":qc.handleRequest
	  }
	}
	
	function dispatchToCF(type, func, callback) {
	  var result, err, obj
//	  console.log('dispatch to cf')
	  
	  state.cfIndex ++
	  try {
	    obj = newStackObject()
	    result = func.call(obj, data, obj)
	  } catch (error) {
	    self.emit('errored', error, data, state.cfIndex)
	    selfDestruct(true)
	    return
	  }
	  
	  if (result === qc.STACK_CONTINUE) {
	    callback()
	  } else if (result === qc.STACK_EXIT) {
	    selfDestruct()
	  } else if (type == "DCF",result === qc.WAIT_FOR_DATA) {
	    state.waitingCallback = callback
	    self.emit('waiting', data, state.cfIndex)
	  } else {
	    err = new Error("Improper CF return value: " + util.inspect(result))
	    self.emit('errored', err, data, state.cfIndex)
	  }
	}
	
	function defaultCallback() {
	  qc.nextTick(dispatch)
	}
	function testingCallback() {
	  self.emit('CFComplete', data, state.cfIndex)
	  defaultCallback()
	}
	
	function ValCFsDoneCallback() {
	  self.emit('validated', data, state.cfIndex)
	  qc.nextTick(dispatch)
	}
	function ValCFsDoneTestingCallback() {
	  self.emit('CFComplete', data, state.cfIndex)
	  ValCFsDoneCallback()
	}
	
	function DCFsDoneCallback() {
	  self.emit('datad', data, state.cfIndex)
	  qc.nextTick(dispatch)
	}
	function DCFsDoneTestingCallback() {
	  self.emit('CFComplete', data, state.cfIndex)
	  DCFsDoneCallback()
	}
	
	function VCFsDoneCallback() {
	  self.emit('viewed', data, state.cfIndex)
	  qc.nextTick(selfDestruct)
	}
	function VCFsDoneTestingCallback() {
	  self.emit('CFComplete', data, state.cfIndex)
	  VCFsDoneCallback()
	}
	
	function asyncStackContinue(key, results) {
	  data[key] = results
	  qc.nextTick(state.waitingCallback)
	}
	function asyncStackExit(key, results) {
	  data[key] = results
	  selfDestruct()
	}
	function asyncStackError(error) {
	  self.emit('errored', error)
    selfDestruct(true)
	}
	
	function selfDestruct(err) {
	  ValCFs.length = 0//probably don't need these in some cases. oh well.
	  DCFs.length = 0
	  VCFs.length = 0
	  if (!err) {
	    self.emit('ended', data, state.cfIndex)
	  }
	}
}
util.inherits(QuickConnectStack, events.EventEmitter);

/* events emitted by the stack:
  started
  ended
  waiting
  errored
  validated
  datad
  viewed
  CFComplete (if testing)
*/

exports.Stack = QuickConnectStack