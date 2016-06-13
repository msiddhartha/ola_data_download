'use strict';

module.exports = (observable) => {
	observable.subscribe(
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
				);
};
