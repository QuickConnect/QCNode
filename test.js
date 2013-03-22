var qc = require('./QuickConnectNode')

function async(data, UUID){
	qc.nextTick(function () {
		qc.asyncStackContinue(UUID, 'result', 'world')
	})
	return qc.WAIT_FOR_DATA
}

function done(data) {
	console.log('hello '+data.result)
	return qc.STACK_CONTINUE
}

qc.mapCommandToDCF('test',async)
qc.mapCommandToDCF('test',done)

qc.handleRequest('test',{},function (data) {
	console.log('data? '+data)
})