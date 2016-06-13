'use strict';

let Mysql = require('mysql');

let dbConnPool = {};

module.exports = (db_conf) => {
	// Singleton per schema..
	if(!dbConnPool.hasOwnProperty(db_conf.schema)) {
		let dbConn = Mysql.createConnection({
					  host     : db_conf.host,
					  user     : db_conf.user,
					  password : db_conf.password,
					  database : db_conf.schema
					});
		dbConnPool[db_conf.schema] = dbConn;
	}	

	return dbConnPool[db_conf.schema];	
};
