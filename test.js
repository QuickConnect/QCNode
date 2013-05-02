var mod = require('./QuickConnect'),
	myQC = new mod.QuickConnect,
	mapper = myQC.mapper

myQC.handleRequest('josh',{})

mapper.mapCommandToValCF('morgen', function (data) {console.log('one',arguments)})
mapper.mapCommandToDCF('morgen', function (data) {console.log('two')})
mapper.mapCommandToVCF('morgen', function (data) {console.log('three')})

myQC.handleRequest('morgen',{'secret':'helol wold'},function () {console.log('callback')})
//function async(data, UUID){
//	qc.nextTick(function () {
//		qc.asyncStackContinue(UUID, 'result', 'world')
//	})
//	return qc.WAIT_FOR_DATA
//}
//
//function done(data) {
//	console.log('hello '+data.result)
//	return qc.STACK_CONTINUE
//}
//
//qc.mapCommandToDCF('test',async)
//qc.mapCommandToDCF('test',done)
//
//qc.handleRequest('test',{},function (data) {
//	console.log('data? '+data)
//})

