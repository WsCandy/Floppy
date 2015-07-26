$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].visibleSlides === 1 ? '0' : core['options'].slideSpacing,
			events = ['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'];

		transition.setUp = function() {

			core['elem']['slides'].wrapAll('<div class="carousel" />');

			core['elem']['carousel'] = core['self'].find('.carousel');
			core['elem']['carousel'].css({

				'width' : ((100 * core.ins['publicF'].slideCount()) / core['options'].visibleSlides) + ((core.ins['publicF'].slideCount() -1) * spacing) + '%',
				'float' : 'left',
				'position' : 'relative',
				'transition' : core['options'].speed / 1000+'s transform',

			});
			
			core['elem']['slides'].css({

				'float' : 'left',
				'width' : ((1 / core.ins['publicF'].slideCount()) * 100) - spacing + (spacing / core.ins['publicF'].slideCount()) + '%',
				'margin-right' : spacing + '%',
				'position' : 'relative',
				'display' : 'block'

			});

			var start,
				total,
				currentPos,
				percent,
				startTime,
				endTime;

			if(core['ins'].cssSupport === true) {

				core['elem']['inner'].on('mousedown', function(e) {
					
					currentPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);
					start = e.pageX;

					startTime = new Date().getTime();

					core['elem']['carousel'].addClass('active');

				});

				core['elem']['inner'].on('mousemove', function(e) {

					if(core['elem']['carousel'].hasClass('active')) {

						total = (e.pageX - (start - (currentPos ? currentPos : 0) ));
						percent = (total / core['elem']['carousel'].width()) * 100

						core['elem']['carousel'].css({

							'transition' : '0s transform',
							'transform' : 'translate3d('+percent+'%, 0, 0)'

						});

					}

				});

				core['elem']['inner'].on('mouseup mouseleave', function(e) {

					if(core['elem']['carousel'].hasClass('active')) {

						endTime = new Date().getTime();

						var speed = (startTime - endTime) / 1000,
							target = Math.round((percent + speed) / 10);

						core['elem']['carousel'].css({

							'transition' : core['options'].speed / 1000+'s transform',
							'transform' : 'translate3d('+target * 10+'%, 0, 0)'

						});

						core['elem']['carousel'].removeClass('active');
						
					}

				});

			}

		}

		transition.forward = function(difference) {

			if(core['ins'].cssSupport === true) {

				core['elem']['carousel'].css({

					'transition' : core['options'].speed / 1000+'s transform',
					'transform' : 'translate3d(-' + ((100 / core.ins['publicF'].slideCount()) + (spacing / core.ins['publicF'].slideCount())) + '%, 0, 0)'

				});

				for(var i = 0; i < events.length; i++) {

					core['elem']['carousel'][0].addEventListener(events[i], function(){

						core['elem']['carousel'].css({

							'transition' : '0s transform',
							'transform' : 'translate3d(0%, 0, 0)'

						});

						for(var i = 0; i < difference; i++) {

							core['elem']['slides'].eq(i).appendTo(core['elem']['carousel']);

						}

					});		
				
				}				

			} else {

				var callback = function() {

					core['elem']['carousel'].css({

						'left' : '0%'

					});

					for(var i = 0; i < difference; i++) {

						core['elem']['slides'].eq(i).appendTo(core['elem']['carousel']);

					}

				}

				core['elem']['carousel'].animate({

					'left' : '-' + ((100 * difference) + ((spacing * core.ins['publicF'].slideCount()) * difference)) / core['options'].visibleSlides + '%'

				}, core['options'].speed, callback);				

			}

		}

		transition.back = function(difference) {

			for(var i = 0; i > difference; i--) {

				core.ins['publicF'].reIndex();
				core['elem']['slides'].eq(core.ins['publicF'].slideCount() -1).prependTo(core['elem']['carousel']);

			}
			
			core['elem']['carousel'].css({

				'left' : ((100 * difference) - ((spacing * core.ins['publicF'].slideCount()) * Math.abs(difference))) / core['options'].visibleSlides + '%'

			});

			core['elem']['carousel'].animate({

				'left' : '0%'

			}, core['options'].speed);

		}

	}

});