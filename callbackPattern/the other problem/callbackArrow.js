CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function () {
    CallbackArrow.firstFunction(function (arg) {
        // * 첫 번째 콜백 로직
        CallbackArrow.secondFuction(function (arg) {
            // * 두 번째 콜백 로직
            CallbackArrow.thirdFunction(function (arg) {
                // * 세 번째 콜백 로직
                CallbackArrow.fourthFunction(function (arg) {
                    // * 네 번째 콜백 로직
                });
            });
        });
    });
};

CallbackArrow.firstFunction = function (callback1) {
    callback1(arg);
};

CallbackArrow.secondFuction = function (callback2) {
    callback2(arg);
};

CallbackArrow.thirdFunction = function (callback3) {
    callback3(arg);
};

CallbackArrow.fourthFunction = function (callback4) {
    callback4(arg);
};