#!/usr/bin/env node
"use strict";

let olaApp = module.exports = require("koa")();
let router = require("koa-route");
let parseBody = require("koa-better-body")();

//Configuration bootstrap..
let config = require('./config')(olaApp.env);

// HTTP bootstrap..
//middleware..
olaApp.use(parseBody);

// routes..
let apihandler = require("./routes/api.js")(config);
olaApp.use(router.get("/api/export_ola_data/:import_id" , apihandler.exportOlaData));

if (module.parent) {
  module.exports = olaApp.callback();
} else {
	// start it
	olaApp.listen(config.port, function () {
		console.log("~~~The app is started. Listening on port "+ config.port);
		console.log("~~~This is the configuration we're running:");
		console.log(config);
	});
}
