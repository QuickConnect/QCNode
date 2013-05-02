var events = require('events')
	util = require('util')

function QuickConnectStack(id, funcs, qc, callback) {
	events.EventEmitter.call(this)
	
	function go() {
		console.log('go!')
	}
	this.go = go
}
util.inherits(QuickConnectStack, events.EventEmitter);

exports.Stack = QuickConnectStack