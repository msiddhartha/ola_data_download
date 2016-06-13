'use strict';

let Rx = require('rxjs');

let getOlaMbgCalc = (dbConn, import_id) => {
	let __promisedMbgCalc =  new Promise((resolve, reject) => {
				let __olaMbgCalcQ = 'SELECT car_number, txn_day, post_day, amount, type, description, malformed FROM ola_acc_stmt_mbg_calc WHERE import_id = '+ import_id;
				dbConn.query(__olaMbgCalcQ, function(err, rows, fields) {
				  if (err) {									  
					  reject(err);
				  }			
				  //console.log("Query: %s", __olaMbgCalcQ);	
				  resolve(rows);
				});								 
			 });	
	return Rx.Observable.fromPromise(__promisedMbgCalc).map( 
					 (x, idx, obs) => { 
						return x.map((el, elidx) => {							
							let y = [];
							  y.push(el.car_number);
							  y.push(el.txn_day);
							  y.push(el.post_day);
							  y.push(el.amount);
							  y.push(el.type);
							  y.push(el.description);
							  y.push(el.malformed);
							  return y;
							});							  
						  }).flatMap(function(x) { return x; });
}

module.exports = (ctx, dbConn, import_id) => {							  
	return Rx.Observable.of(['Car Number', 'Transaction Date', 'Post Date', 'Amount', 'Type', 'Description', 'Malformed']).merge(getOlaMbgCalc(dbConn, import_id));	
};
