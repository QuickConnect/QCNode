var Mapper = require('./Mapper'),
	Stack = require('./Stack').Stack

function QuickConnect(testing, debug) {
	var mapper, executionMap, debug

	this.WAIT_FOR_DATA = 'wAiT'
	this.STACK_EXIT = 'ExIt_StAcK'
	this.STACK_CONTINUE = true
	
	mapper = new Mapper
	this.mapper = mapper
	
	debug = debug || console.log
	this.debug = debug
	
	function blah(){
    var immediateExists = true
    try{
      setImmediate(function(){})
    } catch (e) {
      immediateExists = false
    }
    this.nextTick = function (fn, prefereNextTick) {
      if (prefereNextTick || !immediateExists) {
        process.nextTick(fn)
      } else {
        setImmediate(fn)
      }
    }
  }
  blah.call(this)
	
	fakeQC = (function (self) {
  	return {
  		WAIT_FOR_DATA : 'wAiT',
  		STACK_EXIT : 'ExIt_StAcK',
  		STACK_CONTINUE : true,
  		handleRequest: (function () {
  			return function () {
  				return handleRequest.apply(self, [].slice.call(arguments,0))
  			}
  		})(),
  		handleRequests: (function () {
  			return function () {
  				return handleRequests.apply(self, [].slice.call(arguments,0))
  			}
  		})(),
  		debug: self.debug,
  		nextTick: self.nextTick
  	}
  })(this)
	
	executionMap = {}
	
	function genrateUUID() {
	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g
	    , function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
	    return v.toString(16)
	  })
	  return uuid
	}
	
	function handleRequest(aCmd, requestData, callback/*, runBackground*/) {
		uuid = genrateUUID()
		funcs = cloneConsumableStacks(aCmd, uuid)
		if (!funcs) {
			console.warn('WARNING: attempting to execute the command "'
			  + (aCmd || 'missing')+'" for which no control functions are mapped.')
			  return
		}
		stack = new Stack(uuid, funcs, requestData, fakeQC, callback, testing)
		this.nextTick(function () {
			stack.go()
		})
		return stack
	}
	
	function handleRequests(aCommandArray, requestData
	                    , allStacksCompleteCallback, runParallel/*, runBackground*/) {
	    
	    var uuid, i, count, aCmd, stacks = [], oldStack, stack, tail
	    
		if (!aCommandArray || aCommandArray.length == 0){
		  console.warn('WARNING: attempting to execute a request without one or more commands.')
		}
		if (!Array.isArray(aCommandArray)) {
		  aCommandArray = [aCommandArray]
		}
		
		aCommandArray = aCommandArray.slice()
		
		for (i = 0, count = aCommandArray.length; i < count; i++) {
			uuid = genrateUUID()
			aCmd = aCommandArray[i]
			funcs = cloneConsumableStacks(aCmd, uuid)
			if (!funcs) {
				console.warn('WARNING: attempting to execute the command "'
				  + (aCommandArray[0] || 'missing')+'" for which no control functions are mapped.')
				  return
			}
			stack = new Stack(uuid, funcs, requestData, fakeQC, callback, testing)
			if (oldStack && !runParallel) {
				oldStack.next = stack
			}
			stacks.push(stack)
		}
		this.nextTick(function () {
			stacks[0].go()
		})
		return stacks
	}
	this.handleRequest = handleRequest
	
	function cloneConsumableStacks(aCmd, uuid){
	
	  //var aCmd = aCommandArray.shift()
	  //debug('cloning: ')
	  var funcs = {
	  	"validationMapConsumables": {},
	  	"dataMapConsumables": {},
	  	"viewMapConsumables": {}
	  }
	  //debug("Command: "+aCmd)
	  //if mappings are found then duplicate the mapped 
	  //control function arrays for consumption
	  if (!mapper.validationMap[aCmd] && !mapper.dataMap[aCmd] 
	          && !mapper.viewMap[aCmd]) {
	    //debug("returning null as the command")
	    return
	  }
	
	  funcs.validationMapConsumables[uuid] = (mapper.validationMap[aCmd] || [] ).slice()
	  funcs.dataMapConsumables[uuid] = (mapper.dataMap[aCmd] || [] ).slice()
	  funcs.viewMapConsumables[uuid] = (mapper.viewMap[aCmd] || [] ).slice()
	  
	  return funcs
	}

}
exports.QuickConnect = QuickConnect
exports.sharedQC = new QuickConnect