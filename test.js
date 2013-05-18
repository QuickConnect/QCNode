var mod = require('./QuickConnect'),
	myQC = new mod.QuickConnect(true),
	mapper = myQC.mapper,
	stacker

myQC.handleRequest('josh',{})

mapper.mapCommandToValCF('morgen', function (data) {console.log('one',arguments);return this.STACK_CONTINUE})
mapper.mapCommandToDCF('morgen', function (data) {
  console.log('two')
  var self = this
  setTimeout(function () {
    console.log(self)
    self.asyncStackContinue('hello',true)
  }, 1000)
  return this.WAIT_FOR_DATA
})
mapper.mapCommandToVCF('morgen', function (data) {console.log('three');return this.STACK_EXIT})

stacker = myQC.handleRequest('morgen',{'secret':'helol wold'},function () {console.log('callback')})


stacker.on('started',function (data) {console.log('hey!')})
stacker.on('CFComplete',function (data, index) {console.log('hey!',index)})
stacker.on('errored',function (err, data, index) {console.log('hey!',err.stack,index)})
stacker.on('ended',function (data, index) {console.log('hey!',index,data)})


myQC.command('short cut', function () {
	this.valcf( function (data) {console.log('short cut1'); return true}, function (data) {console.log('short cut2'); return true}, function (data) {console.log('short cut3'); return true}, function (data) {console.log('short cut4'); return true} )
	this.dcf(function(data) {console.log('short cut dcf'); return true})
})

myQC.handleRequest('short cut',{}, function (data) {console.log('short cut done!')})
