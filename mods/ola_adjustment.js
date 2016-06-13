'use strict';

let Rx = require('rxjs');

let getOlaAdjustments = (dbConn, import_id) => {
	let __promisedAdjustments =  new Promise((resolve, reject) => {
				let __olaAdjustmentsQ = 'SELECT car_number, txn_day, post_day, amount, type, description, malformed FROM ola_acc_stmt_adjustment WHERE import_id = '+ import_id;
				dbConn.query(__olaAdjustmentsQ, function(err, rows, fields) {
				  if (err) {									  
					  reject(err);
				  }			
				  //console.log("Query: %s", __olaAdjustmentsQ);	
				  resolve(rows);
				});								 
			 });	
	return Rx.Observable.fromPromise(__promisedAdjustments).map( 
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
						  }).flatMap(function(x) { return x; });/*.subscribe(
					function (x) { 
									//console.log('Obzerable...');
									console.log(x);
								},
					function (err) { 
									 console.log('Error: ' + err); 
									},
					function () { 
									// complete...
								}
				);;*/
}

module.exports = (ctx, dbConn, import_id) => {							  
	return Rx.Observable.of(['Car Number', 'Transaction Date', 'Post Date', 'Amount', 'Type', 'Description', 'Malformed']).merge(getOlaAdjustments(dbConn, import_id));	
};
