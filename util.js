Utilities = function(game){
    game.util = this;

    this.dynamic = function(target, property, getter, setter){
        Object.defineProperty(target, property, {
            get: getter,
            set: setter===undefined ?
                 function( ){ property = getter.call(this); } :
                 function(v){ property = setter.call(this, v); },
            configurable: true,
            enumerable : false
        });
    };

    this.isfunc = function(check){
        return check && {}.toString.call(check) === '[object Function]';
    };
};