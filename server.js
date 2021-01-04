// declaring requirements
const http = require('http');
const util = require('util');
const fs = require('fs');
const exec = require('child_process').exec;
const querystring = require('querystring');
// global constants
const server = http.createServer();
const port = 5812;
const name = "BREND-API"
const logPath = "logs/output.log";
const movegenPath = "/home/brendan/hax/c_files/chess/move_generator/out";
// const inputFEN = "r1bqk1nr/pppp1ppp/2n5/b7/3NP3/P1N5/1PP2PPP/R1BQKB1R w KQkq f3 2 15";

// helper functions
var logStream = fs.createWriteStream(__dirname + '/' + logPath, {flags : 'a'});
// TODO: test that this is async
var logfile = async function(...d) {
	let time = new Date().toLocaleString();
	for (let i = 0 ; i < d.length ; i++){
		logStream.write(util.format('['+time+'] '));
		logStream.write(util.format(d[i]) + '\n');
		//log_file.write(`[${time}]`, util.format(d[i]) + '\n');
		process.stdout.write(util.format('['+time+'] '));
		process.stdout.write(util.format(d[i]) + '\n');
	}
};

// meat and potatoes
// same as http.createServer(()=>{});
server.on('request', async (req, res) => {
	const { method, url } = req;
	const { headers } = req;

	let unixTime = Math.round(Date.now()/1000);
	let dateTime = new Date().toLocaleString();

	// log the new request and details of interest
	logfile(" == NEW REQUEST == ");
	let urlsplit = req.url.split('?');
	let baseURL= urlsplit[0];
	let inputFEN = querystring.parse(urlsplit[1])["fen"];
	logfile("inputFEN: " + inputFEN);
	let reqDetails = {
		"method": method,
		"url": url,
		"unixTime": unixTime,
		"dateTime": dateTime,
		"address": req.connection.remoteAddress
	}
	Object.keys(reqDetails).forEach((ele, index) => {
		logfile(ele + ": " + reqDetails[ele]);
	});

	res.setHeader('Access-Control-Allow-Origin', '*');

	if(baseURL === '/'){
		res.write('Thanks for using BrendAPI!\n');
		res.write('Use /fen for a random move.\n');
		res.end();
	} else if(baseURL === '/fen'){
		let cmd = /* "sleep 2; " + */ movegenPath + " -f \"" + inputFEN + "\"";
		logfile("cmd: " + cmd);
		exec(cmd, (err, stdout, stderr) => {
			res.write(stdout);
			logfile("stdout: " + stdout);	
			res.end();
		});
	} else {
		res.end();
	}
});

var serverInit = () => {
	server.listen(port);
	logfile('Listening on port: ' + port);
	logfile(name + ' is ready to accept requests.');
}

// SERVER START

let startTime = new Date().toLocaleString();
logfile('\n\n   #####   Starting ' + name + ' at ' + startTime + '   #####   \n\n');

(async () => {
	serverInit();
})();

