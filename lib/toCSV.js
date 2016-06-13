'use strict'
let Fs = require('fs');

module.exports = (obzerable, exportPath) => {
	
return obzerable.map(function (x, idx, obs) {
				  return x.map(JSON.stringify.bind(JSON)).join(',');
			  }).reduce(
						function(prev, curr){
							return prev.concat('\n', curr);
						}
				);/*.subscribe(
							function (x) { 
											console.log(x);
										},
							function (err) { 
											 console.log('Error: ' + err); 
											},
							function () { 
											console.log('Subscription complete..!!');
										}
					).first(function (x, idx, obs) {
					return new Promise((resolve, reject) => {
									Fs.writeFile(exportPath, x, { encoding: 'utf8' }, function (err, res) {
													if (err) {
														reject.log(err);
													} else {
														console.log('File written %s', exportPath);
														resolve(res);
													}
												  });
								  });
					
					});*/
};
