'use strict';

let Rx = require('rxjs');

let getOlaTrips = (dbConn, import_id) => {
	let __promisedTrips =  new Promise((resolve, reject) => {
				let __olaTripsQ = 'SELECT car_number, trip_day, trip_time, trip_type, crn_osn, crn_osn_type, distance_kms, ride_time_mins, operator_bill, ola_commission, ride_earnings, tolls, tds, net_earnings, cash_collected, malformed FROM ola_acc_stmt_booking_details WHERE import_id = '+ import_id;
				dbConn.query(__olaTripsQ, function(err, rows, fields) {
				  if (err) {									  
					  reject(err);
				  }			
				  //console.log("Query: %s", __olaTripsQ);	
				  resolve(rows);
				});								 
			 });	
	return Rx.Observable.fromPromise(__promisedTrips).map( 
					 (x, idx, obs) => { 
						return x.map((el, elidx) => {							
							let y = [];
							  y.push(el.car_number);
							  y.push(el.trip_day);
							  y.push(el.trip_time);
							  y.push(el.trip_type);
							  y.push(el.crn_osn);
							  y.push(el.crn_osn_type);
							  y.push(el.distance_kms);
							  y.push(el.ride_time_mins);
							  y.push(el.operator_bill);
							  y.push(el.ola_commission);
							  y.push(el.ride_earnings);
							  y.push(el.tolls);
							  y.push(el.tds);
							  y.push(el.net_earnings);
							  y.push(el.cash_collected);
							  y.push(el.malformed);
							  return y;
							});							  
						  }).flatMap(function(x) { return x; });
}

module.exports = (ctx, dbConn, import_id) => {							  
	return Rx.Observable.of(['Car Number', 'Trip Date', 'Trip Time', 'Trip Type', 'CRN/OSN', 'CRN/OSN Type', 'Kms',  'Ride Time in Mins', 'Operator Bill', 'Ola Commission', 'Ride Earnings', 'Tolls', 'TDS', 'Net Earnings', 'Cash Collected', 'Malformed']).merge(getOlaTrips(dbConn, import_id));	
};
