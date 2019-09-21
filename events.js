EventRegistry = function EventRegistry(game){
    game.events = this;

    this.registry = {};

    this.listen = function(event, name, namespace, ...args){

        var ns = (typeof namespace === 'undefined') ? game : namespace;
        var func = this.ref(name, ns, ...args);

        if(typeof this.registry[event] === 'undefined'){
            this.registry[event] = {event:null, funcs:[]};
            this.registry[event].event = new Event(event);
        }

        if(this.find(this.registry[event].funcs, name, ns).length < 1){
            this.registry[event].funcs.push({'namespace':ns, 'name':name, 'func':func});
            document.addEventListener(event, func);
            // console.log(this.registry[event].event);
        }
    };

    this.dispatch = function(event, namespace){
        var ns = (typeof namespace === 'undefined') ? game : namespace;
        if(typeof this.registry[event] !== 'undefined' && typeof this.registry[event].event !== 'undefined'){
            document.dispatchEvent(this.registry[event].event);
        }
        else if(typeof this.registry[event]==='undefined'){
            this.registry[event] = {event:null, funcs:[]};
            this.registry[event].event = new Event(event);
            document.dispatchEvent(this.registry[event].event);
            // console.log(this.registry[event].event);
        }
    };

    this.flush = function(){
        for(var event in this.registry)
            for(var func in this.registry[event].funcs)
                this.remove(event, func.name, func.namespace);
        this.registry = {};
    };

    this.clear = function(event){
        for(var func in this.registry[event].funcs)
            this.remove(event, func.name, func.namespace);
        delete this.registry[event];
    };

    this.remove = function(event, func, namespace){
        var ns = (typeof namespace === 'undefined') ? game : namespace;
        if(event in this.registry){
            var idx = this.index(this.registry[event].funcs, func, ns);
            for(var i=0; i<idx.length; i++){
                var fn = this.registry[event].funcs.splice(idx[i], 1)[0];
                document.removeEventListener(event, fn.func);
            }
        }
    };

    this.ref = function(name, ns, ...args){
        var namespaces = name.split(".");
        var context = (typeof ns==='undefined' || ns===null) ? window : ns;
        var func = namespaces.pop();

        for(var i = 0; i < namespaces.length; i++)
            context = context[namespaces[i]];
        return context[func].bind(context, ...args);
    };

    this.exec = function(name, context){
        var args = [].slice.call(arguments).splice(2);
        var func = this.ref(name, context);
        return func.apply(context, args);
    };

    this.find = function(funcs, name, ns){
        return funcs.filter(function(fn){return fn.name == name && fn.namespace==ns;});
    };

    this.index = function(list, name, ns){
        return list.filter(function(fn, index){if(fn.name==name && fn.namespace==ns) return index;});
    };
};