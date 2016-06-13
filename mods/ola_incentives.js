'use strict';

let Rx = require('rxjs');

let getOlaIncentives = (dbConn, import_id) => {
	let __promisedIncentives =  new Promise((resolve, reject) => {
				let __olaIncentivesQ = 'SELECT car_number, txn_day, post_day, amount, bookings, type, description, malformed FROM ola_acc_stmt_incentives WHERE import_id = '+ import_id;
				dbConn.query(__olaIncentivesQ, function(err, rows, fields) {
				  if (err) {									  
					  reject(err);
				  }			
				  //console.log("Query: %s", __olaIncentivesQ);	
				  resolve(rows);
				});								 
			 });	
	return Rx.Observable.fromPromise(__promisedIncentives).map( 
					 (x, idx, obs) => { 
						return x.map((el, elidx) => {							
							let y = [];
							  y.push(el.car_number);
							  y.push(el.txn_day);
							  y.push(el.post_day);
							  y.push(el.amount);
							  y.push(el.bookings);
							  y.push(el.type);
							  y.push(el.description);
							  y.push(el.malformed);
							  return y;
							});							  
						  }).flatMap(function(x) { return x; });
}

module.exports = (ctx, dbConn, import_id) => {							  
	return Rx.Observable.of(['Car Number', 'Transaction Date', 'Post Date', 'Amount', 'Bookings', 'Type', 'Description', 'Malformed']).merge(getOlaIncentives(dbConn, import_id));	
};
