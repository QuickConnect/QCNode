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
			this.dataMap[aCmd] = funcArray
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
			this.dataMap[aCmd] = funcArray
		}
		funcArray.push(aVCF)
	}
	this.mapCommandToVCF = mapCommandToVCF
	
}
module.exports = QuickConnectMapper