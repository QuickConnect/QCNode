function QuickConnectMapper(ops) {
	this.validationMap = {}
	this.dataMap = {}
	this.viewMap = {}
	this.isolateDelimiter = ops.delimiter || '-'
	var self = this
	
	function newMapper(command, space) {
	  var com = space?(space + self.isolateDelimiter + command):command
  	return {
  	  space: '',
    	valcf: function () {
    		var funcs = Array.prototype.slice.call(arguments)
    		for (var i = 0, count = funcs.length; i < count; i++) {
    			self.mapCommandToValCF( com, funcs[i] )
    		}
    	},
    	dcf: function () {
    		var funcs = Array.prototype.slice.call(arguments)
    		for (var i = 0, count = funcs.length; i < count; i++) {
    			self.mapCommandToDCF( com, funcs[i] )
    		}
    	},
    	vcf: function () {
    		var funcs = Array.prototype.slice.call(arguments)
    		for (var i = 0, count = funcs.length; i < count; i++) {
    			self.mapCommandToVCF( com, funcs[i] )
    		}
    	}
    }
  }
  
  function newIsolator(spaces) {
    if (!Array.isArray(spaces)) {
      spaces = [spaces]
    }

    var fakeMapper = newMapper
    return {
      spaces: [],
      isolate: function (innerSpaces, callback) {
        if (!Array.isArray(innerSpaces)) {
          innerSpaces = [innerSpaces]
        }
        innerSpaces = [spaces].concat(innerSpaces)
        
        self.isolate.call(self, innerSpaces, callback)
      },
      command: function (command, callback) {
        var space = spaces.join( self.isolateDelimiter ),
        fakeMapper = newMapper(command, space)
        
        callback.call(fakeMapper)
      }
    }
  }
	
	function mapCommandToValCF(aCmd, aValCF) {
		if(aCmd == null || aValCF == null){
			return
		}
		var funcArray = this.validationMap[aCmd]
		if(funcArray == null) {
			funcArray = []
			this.validationMap[aCmd] = funcArray
		}
		funcArray.push(aValCF)
	}
	this.mapCommandToValCF = mapCommandToValCF
	
	function mapCommandToDCF(aCmd, aDCF) {
		if(aCmd == null || aDCF == null){
			return
		}
		var funcArray = this.dataMap[aCmd]
		if(funcArray == null) {
			funcArray = []
			this.dataMap[aCmd] = funcArray
		}
		funcArray.push(aDCF)
	}
	this.mapCommandToDCF = mapCommandToDCF
	
	function mapCommandToVCF(aCmd, aVCF) {
		if(aCmd == null || aVCF == null){
			return
		}
		var funcArray = this.viewMap[aCmd]
		if(funcArray == null) {
			funcArray = []
			this.viewMap[aCmd] = funcArray
		}
		funcArray.push(aVCF)
	}
	this.mapCommandToVCF = mapCommandToVCF
	
	function checkForStack(name){
		var isThere = true
		isThere = this.viewMap[name] && this.validationMap[name] && this.dataMap[name]
		return !!isThere
	}
	this.checkForStack = checkForStack
	
	function command(command, callback) {
		fakeMapper = newMapper(command)
		callback.call(fakeMapper)
	}
	this.command = command
	
	function isolate(spaces, callback) {
	  var fakeIsolator = newIsolator(spaces)
	  
	  callback.call(fakeIsolator)
	}
	this.isolate = isolate
}
module.exports = QuickConnectMapper
