var moment = require('moment');
let timeoutSec = 0;
var until = moment(new Date()).add(1,'days');
until.set('hour', 8);
until.set('minute', 0);
until.set('second', 0);
var a = moment();
timeoutSec = until.diff(a, 'seconds'); // 1
if(until.diff(a, 'minutes')>1440){
	until = moment(new Date()).add(0,'days');
	until.set('hour', 8);
	until.set('minute', 0);
	until.set('second', 0);
	timeoutSec = until.diff(a, 'seconds'); // 1
}
console.log("Timing out for "+timeoutSec+" second(s).")