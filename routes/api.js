'use strict';

let Fs = require('fs');
let Rx = require('rxjs');
let Archiver = require('archiver');

let appDb = require('./../lib/db.js');
let debugObzerable = require('./../lib/debug_obzerable.js');
let toCSV = require('./../lib/toCSV');
let convertTimestamp = require('./../lib/converTs.js');

let mod_olaImport = require('./../mods/ola_import.js');
let mod_olaAdjustment = require('./../mods/ola_adjustment.js');
let mod_olaBonus = require('./../mods/ola_bonus.js');
let mod_olaTrips = require('./../mods/ola_trips.js');
let mod_olaDDC = require('./../mods/ola_data_device_charges.js');
let mod_olaIncentives = require('./../mods/ola_incentives.js');
let mod_olaMbgCalc = require('./../mods/ola_mbg_calc.js');
let mod_olaPenalty = require('./../mods/ola_penalty.js');
let mod_olaShareCC = require('./../mods/ola_share_cc.js');
let mod_olaShareEarnings = require('./../mods/ola_share_earnings.js');

let appConfig;
let exportPath = '/../data_export/';


let exportOlaData = function *(import_id) {				
	
	let ctx = this;
	let _dbConn = appDb(appConfig.db);
	
	let ola_data_promises = [];
	let ola_adjust_obzerable = toCSV(mod_olaAdjustment(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_adjust_obzerable);
	let ola_incentives_obzerable = toCSV(mod_olaIncentives(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_incentives_obzerable);
	let ola_bonus_obzerable = toCSV(mod_olaBonus(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_bonus_obzerable);
	let ola_trips_obzerable = toCSV(mod_olaTrips(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_trips_obzerable);
	let ola_data_device_charges_obzerable = toCSV(mod_olaDDC(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_data_device_charges_obzerable);
	let ola_mbg_calc_obzerable = toCSV(mod_olaMbgCalc(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_mbg_calc_obzerable);
	let ola_penalty_obzerable = toCSV(mod_olaPenalty(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_penalty_obzerable);
	let ola_share_cash_coll_obzerable = toCSV(mod_olaShareCC(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_share_cash_coll_obzerable);
	let ola_share_earnings_obzerable = toCSV(mod_olaShareEarnings(this, _dbConn, import_id)).toPromise();
	ola_data_promises.push(ola_share_earnings_obzerable);
	
	let olaImportDetails = yield mod_olaImport(_dbConn, import_id);
	console.log('----------------Requested export for corresponding to import# %s [START]----------------', import_id);
	
	if(olaImportDetails.length == 0) {
		let __noRun = 'No such import run: ' + import_id +  '!';
		console.log(__noRun);
		ctx.body = __noRun;
	} else {
		let __period_start = olaImportDetails[0].period_start;
		let __period_end  = olaImportDetails[0].period_end;
		let __period_start_date = convertTimestamp.tz(__period_start);
		let	__period_end_date = convertTimestamp.tz(__period_end);		
		
		let doc_name = olaImportDetails[0].document_name;
		let doc_section = olaImportDetails[0].document_section;
		
		console.log('----------------Import details [START]----------------');
		
		console.log('From# %s', __period_start_date);
		console.log('To# %s', __period_end_date);		
		console.log('Document# %s', doc_name);
		console.log('Section# %s', doc_section);
		
		console.log('----------------Import details [END]----------------');
		
		let periodPrefix = 'from_' + __period_start_date;
		if(__period_start != __period_end) {
			periodPrefix += '_to_' + __period_end_date;
		}
		
		periodPrefix += '_doc_' + doc_name.replace(/[\s\(\)\.]/g, '_');	//replace all (). \s
		periodPrefix += '_section_' + doc_section;
		
		/**
		 * Preparing response -- [START]
		 * */
		let opFile = 'ola_data_' +  periodPrefix + '.zip';
		let outputPath = __dirname + exportPath + opFile;
		let mimetype = 'application/zip';
		ctx.set('Content-disposition', 'attachment; filename=' + opFile);
		ctx.set('Content-type', mimetype);
		ctx.type = require('path').extname(outputPath);
		
		/**
		 * Archiver -- [START]
		 * 
		 */	 
		
		let saveOlaData = Fs.createWriteStream(outputPath);
		saveOlaData.on('close', function() {
		  console.log('File Descriptor# %s', outputPath);	 
		});
		
		let archive = Archiver('zip');
		archive.on('error', function(err) {
		  throw err;
		});
		archive.pipe(saveOlaData);
		
		process.nextTick(() =>  {
				Promise.all(ola_data_promises).then((x) => {			
					archive.finalize((err, bytes) => {
					  if (err) {
						throw err;
					  }
					  console.log(bytes + ' total bytes');
					});	
				});
			}
		);
		
		ola_adjust_obzerable.then((x) => {
			archive.append(x, { name: 'ola_adjustment_' + periodPrefix + '.csv' });		
		});
		ola_incentives_obzerable.then((x) => {
			archive.append(x, { name: 'ola_incentives_' + periodPrefix + '.csv' });		
		});
		ola_bonus_obzerable.then((x) => {
			archive.append(x, { name: 'ola_bonus_' + periodPrefix + '.csv' });		
		});
		ola_trips_obzerable.then((x) => {
			archive.append(x, { name: 'ola_trips_' + periodPrefix + '.csv' });		
		});
		ola_data_device_charges_obzerable.then((x) => {
			archive.append(x, { name: 'ola_data-device-charges_' + periodPrefix + '.csv' });		
		});
		ola_mbg_calc_obzerable.then((x) => {
			archive.append(x, { name: 'ola_mbg-calc_' + periodPrefix + '.csv' });		
		});
		ola_penalty_obzerable.then((x) => {
			archive.append(x, { name: 'ola_penalty_' + periodPrefix + '.csv' });		
		});
		ola_share_cash_coll_obzerable.then((x) => {
			archive.append(x, { name: 'ola_share-cash-coll_' + periodPrefix + '.csv' });		
		});
		ola_share_earnings_obzerable.then((x) => {
			archive.append(x, { name: 'ola_share-earnings_' + periodPrefix + '.csv' });		
		});
		/**
		 * Archiver --  [END]
		 * 
		 */	 	
		
		ctx.body = archive;	
		/**
		 * Preparing response -- [END]
		 * */
	}
	console.log('----------------Requested export for corresponding to import# %s [END]----------------', import_id);
};

module.exports = (appConf) => {
	appConfig = appConf;	
	return {
		exportOlaData: exportOlaData
	};
}
