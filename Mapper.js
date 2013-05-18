function QuickConnectMapper() {
	this.validationMap = {}
	this.dataMap = {}
	this.viewMap = {}
	
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
		var self = this,
		fakeMapper = {
			valcf: function () {
				var funcs = Array.prototype.slice.call(arguments)
				for (var i = 0, count = funcs.length; i < count; i++) {
					self.mapCommandToValCF( command, funcs[i] )
				}
			},
			dcf: function () {
				var funcs = Array.prototype.slice.call(arguments)
				for (var i = 0, count = funcs.length; i < count; i++) {
					self.mapCommandToDCF( command, funcs[i] )
				}
			},
			vcf: function () {
				var funcs = Array.prototype.slice.call(arguments)
				for (var i = 0, count = funcs.length; i < count; i++) {
					self.mapCommandToVCF( command, funcs[i] )
				}
			}
		}
		
		callback.call(fakeMapper)
	}
	this.command = command
}
module.exports = QuickConnectMapper
