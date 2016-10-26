class Sample {
    success(timeout:number): MyQ.MyPromise<{message:string}>{
        var q = MyQ.MyDeferred.defer<{message:string}>();
        setTimeout(()=>{
            var obj = {message:`SUCCESS ${timeout}`};
            q.resolve(obj);
        },timeout);
        return q.promise;
    }
    error(timeout:number): MyQ.MyPromise<{message:string}>{
        var q = MyQ.MyDeferred.defer<{message:string}>();
        setTimeout(()=>{
            q.reject("error has occured.");
        },timeout);
        return q.promise;
    }
}

new Sample().success(0).then(function(val){
    var message = 'OK1:' + val.message;
    console.log(message);
    return message;
}).then(function(val){
    var message = 'OK2:' + val;
    console.log(message);
    throw new Error('ERRRR');
}).catch(function(e){
    console.error(e);
}).finally(function(){
    console.info('sample promise done!');
});

var p1 = new Sample().error(2000);
var p2 = new Sample().success(0);
var p3 = new Sample().success(5000);

MyQ.MyPromise.all([p1, p2, p3]).then(function (vals) {
    console.info(`all then ${JSON.stringify(vals)}`);
}).catch(function (e) {
    console.error(e);
}).finally(function () {
    console.info('all done.');
});

var p4 = new Sample().error(10000);
var p5 = new Sample().success(12000);

MyQ.MyPromise.race([p4, p5]).then(function (val) {
    console.info(`race1 SUCCESS`);
}).catch(function (e) {
    console.error(`race1 ERROR`);
});

var p6 = new Sample().error(10);
var p7 = new Sample().success(15);

MyQ.MyPromise.race([p6, p7]).then(function (val) {
    console.info(`race2 SUCCESS`);
}).catch(function (e) {
    console.error(`race2 ERROR`);
});
