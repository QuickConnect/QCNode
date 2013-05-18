QCNode
======

The QuickConnect Framework for Node.js

## Installation
```
npm install qcnode
```
###### note: as of this writting, I haven't actually published the package yet.

## What is it for?

The QuickConnect framework for Node.js is designed to help the developer quickly write, debug, and run asynchronous or synchronous code. The framework encourages code re-use and modularity. Several tools are provided to help the developer, but if the developer wants to make their life harder by not taking advantage of all of these tools, the framework does not get in the way.

## How do I use it?
Async callback code is all over the place in Node, This async work can be turned into more linear, understandable code by using QC. See the following example of taking normal code and turning it into QC code:

### Example Callback code:
```
resNotExists = function(){
	//um...
	tryAgainOrSomething()
}

asyncFunc(args, function(err, otherArgs){
	if(err){
		throw err //but who will catch it?
	}
	otherAsync(otherArgs, function(err, arggg){
		if(err){
			customErrorCode(err) //what do I do?
		}
		anotherAsyncFunc(arggg, fuction(err, args){
			if(err){
				console.log("please don't ever happen… please")
			}
			res = sync(args) 
			res?'':return resNotExists()
			//but it takes forever to call these two one after the other
			pleaseNoMore(res, function(err){
				if(err){
					//failed at the last step!
				}
			})
		})
	})
})
```
I know that there are other ways to handle this async stuff, but you have to admit => you have written code like this, and it's probably in something you shipped.

### Example QuickConnect code:
```
function first(data, qc){
	asyncFunc(data, function(err, args){
		if(err){
			qc.asyncStackError(err)
			return
		}
		qc.asyncStackContinue('args1',args)
	})
	return qc.WAIT_FOR_DATA
}

function second(data, qc){
	otherAsync(data.args1, function(err, args2){
		if(err){
			qc.asyncStackError(err)
			return
		}
		qc.asyncStackContinue('args2',args2)
	}
	return qc.WAIT_FOR_DATA
}

function third(data, qc){
	anotherAsyncFunc(data.args2, fuction(err, args3){
		if(err){
			qc.asyncStackError(err)
			return
		}
		qc.asyncStackContinue('args3',args3)
	})
	return qc.WAIT_FOR_DATA
}

function sync(data, qc){
	data.res = sync(data.args3)
	if(!res){
		return qc.STACK_EXIT
	}
	return qc.STACK_CONTINUE
}

function fourth(data, qc){
	pleaseNoMore(data.res, function(err){
		if(err){
			qc.asyncStackError(err)
			return
		}
		qc.asyncStackContinue('success',true)
	}
	return qc.WAIT_FOR_DATA
})
…
myQC.command('login', function(){
	this.dcf(first,second,third,sync,fourth)
})

var myData = …

var stack = myQC.handleRequest('login', myData)

stack.on('error', function(err, data, index){
	//handle the error out here, where I know what is going on.
	switch(index){
		case 1:
			…
		case 2:
			…
		ect...
	}
	or
	switch(err.message){
	…
	}
})

stack.on('end', function(data, index){
	if(index < 4){
		//ended early, I can handle that
	} else {
		console.log('yay!')
	}
})

```

## Why is that better?
Admit it, the QC example was easier to read. 

Each task was enclosed in it's own environment where things could be named appropriately and conflicts were less likely. When an error happened, it did not need to be handled right there because it would be caught in the 'error' event for the stack. It was easy to know when the stack was over because the 'end' event got emitted. If you need to add another function to the stack, you just add it here: `this.dcf(first,second,A_NEW_ONE,third,sync,fourth)` and the other functions don't care--you didn't even have to re-indent anything.

## But how can I use it in ...?
Do you have something in your code that looks like this:

```
router.route('help', fuction(key, data){
	//a bunch of async code to handle that case
})
router.route('doStuff', fuction(key, data){
	//a bunch of async code to handle that case
})
router.route('exit', fuction(key, data){
	//a bunch of async code to handle that case
})
```

Take all that async code and create QC stacks with it! Then you just have to trigger those stacks in each case of your router route. Code re-use is a breeze, and you can define the fuctions and map them to commands in other files--whatever works best for you.

If you have async work that you need to do, or a bunch of async things that need to happen serialy, take advantage of QC.

## QC History
QuickConnect started as a response to some of the problems encountered writing code for Enterprise Java servers. The framework pattern evolved for several years in a hybrid mobile environment (QCHybrid, iOS and Android) which provided tools for rapid prototyping of cross-platform apps. 

From the async javascript environment of mobile web views, the jump to Node.js was natural, but required some heavy thinking and adaptation to match the node way of doing things. The first port was done by a developer for a mobile app company--this port was made open source after donation back to the main QC developer. The first version published for install via npm was a complete re-write of that first port; this resulted in a smaller, better QC that fuctions across many versions of node.

### Version numbers
QC is pretty mature and very functional, so it didn't make sense to publish a version <1.0

Here is how it works: When we change to version x.y.z

* x : your stuff will probably break
* y : your stuff will probably not break
* z : we fixed something

## Contribute
Because QC has a history older than Node.js, it has some things in it that are leftovers from other incarnations. 'handleRequest' is the oldest part; it comes from living on a server that handles client requests. It has been pointed out that a 'request', a 'command', and a 'stack' are all related, but come from different points in the history. We want to increase the 'y' part of the version by building better ways for peopel to use QC in their codeflow and workflow.

Fork the repo, submit a pull request, and tell us your rational for the change; we would love to hear all ideas.

We feel the core logic of QC is pretty set in version 1.0.0, but if you have ideas for version 2.0.0, fork the repo or drop us a line!