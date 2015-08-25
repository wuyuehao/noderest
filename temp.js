var date = new Date();
var moment = require('moment')
date.setDate(date.getDate() - 1);
console.log(date.getTime());
console.log(moment(date).format('YYYY-MM-DD'));
