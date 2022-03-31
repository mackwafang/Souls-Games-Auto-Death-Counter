const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const spawn = require("child_process").spawn;

let counter = 0;

fs.readFile("./data.json", "utf-8", function(err, jsonString) {
	if (err) {
		throw new err;
	}
	try {
		const data = JSON.parse(jsonString);
		counter = data['count'];
	}
	catch(err) {
		console.log("JSON Parsing Error: ", err);
	}
});

const port = 8080;
const host = "192.168.1.214"
const jsonParser = bodyParser.json()

var app = express();

app.get("/main", function(req, res) {res.sendFile(__dirname + "/main.html");})
app.get("/style.css", function(req, res) {res.sendFile(__dirname + "/style.css");})
app.get("/main.js", function(req, res) {res.sendFile(__dirname + "/main.js");})

app.get("/obs", function(req, res) {res.sendFile(__dirname + "/obs_end/obs_end.html")})
app.get("/obs_end/obs_end_style.css", function(req, res) {res.sendFile(__dirname + "/obs_end/obs_end_style.css");})
app.get("/obs_end/obs_end.js", function(req, res) {res.sendFile(__dirname + "/obs_end/obs_end.js");})

app.post("/server", jsonParser, async function(req, res) {
	var setting = req.body;
	if (setting['set']) {
		counter = setting['counter'];
		res.send({"counter": counter});
		console.log(`got a get request for setting ${counter}!`);
	}
	else {
		if (!setting['update_pulse']) {
			counter += 1;
			console.log(`got a get request for incrementing!`);
		}
		res.send({"counter": counter});
	}
	res.status(200).end();
});

const server = app.listen(port, host, () => {
	console.log("Listening on "+ host + ":" + port);
});
// spawn ocr detection program
const child_process = spawn("python", ["auto_detect_death.py"], {stdio: 'inherit'})
function exitHandler(options, exitCode) {
	if (options.exit) {
		const outputString = JSON.stringify({"count": parseInt(counter)})
		fs.writeFileSync('./data.json', outputString, err => {
			if (err) {
				console.log('Error writing file', err)
			} else {
				console.log('Successfully wrote file')
			}
		});
		server.close();
		process.exit(0);
		child_process.exit(0)
	}
}
process.on('exit', exitHandler.bind(null, {exit: true}));
process.on('SIGINT', exitHandler.bind(null, {exit: true}));
process.on('SIGTERM', exitHandler.bind(null, {exit: true}));