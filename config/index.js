"use strict";

let config = {
	local: {
		mode: 'local',
		db: {
			host: '127.0.0.1',
			user: 'root',
			password: 'abcd!234',
			schema: 'ouch_20160603'			
		},
		port: 2300	
	},
	staging: {
		mode: 'staging',
		db: {
			host: '',
			user: '',
			password: '',
			schema: ''			
		}	
	},
	prod: {
		mode: 'prod',
		db: {
			host: '188.166.248.4',
			user: 'sub_ouch',
			password: 'jyDsvxN7gYMMYLeVFmNv3szjP3V4BaWF',
			schema: 'ouch'			
		},
		port: 2300
	}
};

module.exports = function (mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
};
