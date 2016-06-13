'use strict';

module.exports = (dbConn, import_id) => {	
	let __promisedImportDetails =  new Promise((resolve, reject) => {
				let __olaImportsQ = 'SELECT period_start, period_end, document_name, document_section FROM ola_imports WHERE id = '+ import_id;
				dbConn.query(__olaImportsQ, function(err, rows, fields) {
				  if (err) {									  
					  reject(err);
				  }			
				  resolve(rows);
				});								 
			 });	
	return __promisedImportDetails;
};
