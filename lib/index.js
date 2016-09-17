"use strict"
const const_strings = {
    AppName: 'WowApp',
    TipCalculator: 'TipCalculator',
    TipKey: 'Tip',
    BroadcastEvenetName: 'LocalStorageModule.notification.setitem'
};

var tipCalculator = function ($scope, localStorageService) {
    //I define an object with set method
    var tip = {
        bill: undefined,
        tenPercent: undefined,
        fifteenPercent: undefined,
        inputs: [],
        set: function (t) {
            console.log('value received', [t]);
            this.bill = t.bill;
            this.tenPercent = t.tenPercent;
            this.fifteenPercent = t.fifteenPercent;
            this.inputs.length = 0; //this is to ensure there are no references left to old object
            if (!(t.inputs === undefined)) {
                this.inputs = t.inputs;
            }
        }
    }
    
    //**ADVANCED TOPIC** I am listening on event being broadcasted 
    $scope.$on(const_strings.BroadcastEvenetName, function (data) {
        console.log('Event received: ', [JSON.stringify(data[0])]);
        computeTip();
    });
    
    //I assign the tip object to the $scope so any changes to tip object should propegate to view
    $scope.tip = tip;
    $scope.typed = function (input) {
        console.debug('Typed input:', [input]);
        tip.inputs.length = 0;
        tip.inputs.push(input);
        //I save the object via the service: note this will only save properties not function and then broadcast the changes 
        localStorageService.set(const_strings.TipKey, tip);
    }
    $scope.press = function (input) {
        console.debug('Pressed number:', [input]);
        tip.inputs.push(input);
        //I save the object via the service: note this will only save properties not function and then broadcast the changes 
        localStorageService.set(const_strings.TipKey, tip);
    };
    $scope.reset = function () {
        //I reset the object and then broadcast the changes 
        localStorageService.set(const_strings.TipKey, {});
    };

    //this is the core business logic 
    var computeTip = function () {
        tip.set(localStorageService.get(const_strings.TipKey));
        var result = tip.inputs.join('') * 10 / 100;
        tip.tenPercent = result === 0 ? '' : result;
        result = tip.inputs.join('') * 15 / 100;
        tip.fifteenPercent = result === 0 ? '' : result;
        tip.bill = tip.inputs.join('');
    };
}

angular.module(const_strings.AppName, ['LocalStorageModule'])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix(const_strings.AppName);
        localStorageServiceProvider.setDefaultToCookie(false);
        localStorageServiceProvider.setNotify(true, true);
    })
    .controller(const_strings.TipCalculator, this.tipCalculator);

