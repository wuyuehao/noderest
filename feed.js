var request = require('request');
var async = require('async');
var date = new Date();
var http = require('http');
var https = require('https');
var moment = require('moment')
var sslRootCAs = require('ssl-root-cas/latest')
sslRootCAs.inject()

date.setDate(date.getDate() - 1);
var yesterday = moment(date).format('YYYY-MM-DD');
var start = moment(date).unix() + 3600;


date.setDate(date.getDate() + 2);
var tomorrow = moment(date).format('YYYY-MM-DD');
var end = moment().unix();

console.log(start);
console.log(end);

var count=0;
var tier1 =[];
var tier2 =[];
var sb={};

var options1 = {
  host: '10.24.0.174',
  port: 9000,
  path: '/v1/atb/riskvbaseserv?start='+start+'&end='+end
};

var options2 = {
  host: '10.24.0.174',
  port: 9000,
  path: '/v1/atb/idiriskaccessserv?start='+start+'&end='+end
};

var options3 = {
  host: 'ews.paypalinc.com',
  path: '/rest/IDI_DB_Blocked_sessions_5MIN?max_wait_ms=50&startTime=%27'+yesterday+'%27&endTime=%27'+tomorrow+'%27',
  "rejectUnauthorized": false
};

console.log(options1.path);
console.log(options2.path);
console.log(options3.path);


var url = '';


callback1 = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    	tier1 = JSON.parse(str)[0].data;
	count++;
	if(count == 3){
		callback();
	}else{
		//console.log(count);
	}
	//console.log(tier1);
  });
}

callback2 = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
        tier2 = JSON.parse(str)[0].data;
        count++;
	if(count == 3){
                callback();
        }else{
                //console.log(count);
        }
	//console.log(data[0].data);
  });
}

callback3 = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
        var body = JSON.parse(str).value;
	for(var i=0;i<body.length;i++){
		key = parseInt(body[i]["SQL2U(CAPTURE_DATE)"]);
		v1 = parseFloat(body[i].Concurrency);
		v2 = parseFloat(body[i].Cluster);
		sb[key]=[v1,v2];
	}
	count++;
        if(count == 3){
                callback();
        }else{
                //console.log(count);
        }
	//console.log(sb);
  });
}


callback = function(){
var x = [];
var t1=[];
var t2=[];
var con=[];
var clu=[];
	console.log(tier1.length);
	console.log(tier2.length);
	for(var i=0, j=0;i<tier1.length && j<tier2.length;){
		// missing tier2 data, ignore tier1 data points.
		if(!tier2[i][0] || tier1[i][0] < tier2[j][0]){
			i++;
			console.log("ignore tier1");
			continue;
		//missing tier1 data, ignore tier2 data points.
		}else if(tier1[i][0] > tier2[j][0]){
			j++;
			console.log("ignore tier2");
			continue;
		}
		
		//console.log(tier1[i][0] +  " | " + tier2[i][0]);
		var d = moment(tier1[i][0]*1000).format("HH:mm");
		x.push(d);
		t1.push(tier1[i][1]);
		t2.push(tier2[i][1]);
		if(sb[tier1[i][0]]){
			//console.log("found");
			con.push(sb[tier1[i][0]][0]);
			clu.push(sb[tier1[i][0]][1]);
		}else{
			con.push(0);
                        clu.push(0);
		}
		i++;
		j++;
	}

	var options = {
  	hostname: 'damp-everglades-9236.herokuapp.com',
  	path: '/data',
  	method: 'POST',
  	headers: {
    		'Content-Type': 'application/json',
  	}
	}
        var req = http.request(options, function(res) {
  		//console.log('STATUS: ' + res.statusCode);
  		//console.log('HEADERS: ' + JSON.stringify(res.headers));
  		res.setEncoding('utf8');
  		res.on('data', function (chunk) {
    		//console.log('BODY: ' + chunk);
  		});
	});
	req.write(JSON.stringify({x:x, tier1: t1, tier2: t2, concurrency: con, cluster: clu}));
	req.end();
//	console.log({x:x, tier1: t1, tier2: t2, concurrency: con, cluster: clu});
}



//request(url, callback3);
//async.parallel([
//    function(){http.request(options1, callback1).end() },
//    function(){http.request(options2, callback2).end() },
//    function(){https.get(options3, callback3).end()}
//], callback);

http.request(options1, callback1).end();
http.request(options2, callback2).end();
https.get(options3, callback3).end();
