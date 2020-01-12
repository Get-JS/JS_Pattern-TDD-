CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function () {
    CallbackArrow.firstFunction(CallbackArrow.firstCallback);
};
CallbackArrow.firstCallback = function () {
    // * 첫 번째 콜백로직
    CallbackArrow.secondFuction(CallbackArrow.secondCallback);
};
CallbackArrow.secondCallback = function () {
    // * 두 번째 콜백로직
    CallbackArrow.thirdFunction(CallbackArrow.thirdCallback);
};

CallbackArrow.thirdCallback = function () {
    // * 세 번째 콜백로직
    CallbackArrow.fourthCallback(CallbackArrow.fourthCallback);
};

CallbackArrow.fourthCallback = function () {
    // * 네번째 콜백로직
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