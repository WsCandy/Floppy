;(function() {

	'use strict';

	window.propCore = {};
	
	var events = {}, operation;

	var tidy = function(operation, task) {

		var result = operation.split('__');
			
		if(task === true) {

			result = result[0];

		} else {

			result.shift();

		}

		return result;

	}

	var bindEvents = function(events, operation) {

		var clean = tidy(operation, true);

		for(var i = 0; i < events.length; i++) {

			$(events[i] == 'ready' ? document : window).on(events[i], function() {

				try {

					propCore[clean] = new propFuncs[operation];

				} catch(error) {

					if(console) {

						console.error('['+ operation +' error] - ' + error['message']);
						
					}

				}

			});

		}

	}

	for(operation in window.propFuncs) {
				
		var clean = tidy(operation, true);

		events[clean] = tidy(operation);				
		bindEvents(events[clean], operation);

	}

})();