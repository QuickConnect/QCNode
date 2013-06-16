var Mapper = require('./Mapper'),
    Stack = require('./Stack').Stack

function QuickConnect(testing, debug) {
    var mapper, executionMap, debug, fakeQC

    this.WAIT_FOR_DATA = 'wAiT'
    this.STACK_EXIT = 'ExIt_StAcK'
    this.STACK_CONTINUE = true

    mapper = new Mapper
    this.mapper = mapper

    debug = debug || console.log
    this.debug = debug

    function blah() {
        var immediateExists = true
        try {
            setImmediate(function () {})
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
            WAIT_FOR_DATA: 'wAiT',
            STACK_EXIT: 'ExIt_StAcK',
            STACK_CONTINUE: true,
            handleRequest: function () {
                return handleRequest.apply(self, [].slice.call(arguments, 0))
            },
            handleRequests: function () {
                return handleRequests.apply(self, [].slice.call(arguments, 0))
            },
            checkForStack: function () {
                return checkForStack.apply(self, [].slice.call(arguments, 0))
            },
            debug: self.debug,
            nextTick: self.nextTick
        }
    })(this)

    executionMap = {}

    function genrateUUID() {
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
        })
        return uuid
    }

    function handleRequest(aCmd, requestData, callbacks ) {
        var stack, uuid, funcs, event
        if (callbacks && callbacks.constructor != Object) {
            callbacks = {
                'end': callbacks
            }
        }
        uuid = genrateUUID()
        funcs = cloneConsumableStacks(aCmd)
        if (!funcs) {
            throw new Error('Attempting to execute the command "' + (aCmd || 'missing') + '" for which no control functions are mapped.')
        }
        stack = new Stack(uuid, funcs, requestData, fakeQC, testing)
        for (event in callbacks) {
            stack.on(event, callbacks[event])
        }
        this.nextTick(stack.go)
        return stack
    }
    this.handleRequest = handleRequest
    this.run = handleRequest


    function cloneConsumableStacks(aCmd) {

        var funcs = {
        }

        //if mappings are found then duplicate the mapped 
        //control function arrays for consumption
        if (!mapper.validationMap[aCmd] && !mapper.dataMap[aCmd] && !mapper.viewMap[aCmd]) {
            return
        }

        funcs.validationMapConsumables = (mapper.validationMap[aCmd] || []).slice()
        funcs.dataMapConsumables = (mapper.dataMap[aCmd] || []).slice()
        funcs.viewMapConsumables = (mapper.viewMap[aCmd] || []).slice()

        return funcs
    }

    function checkForStack(stackName) {
        return this.mapper.checkForStack(stackName)
    }
    this.checkForStack = checkForStack

    function command(command, callback) {
        this.mapper.command(command, callback)
    }
    this.command = command
}
exports.QuickConnect = QuickConnect
exports.sharedQC = new QuickConnect