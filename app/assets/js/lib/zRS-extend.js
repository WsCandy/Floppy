$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].slideSpacing,
			visibleSlides = core['options'].visibleSlides,
			publicF = core.ins['publicF'],
			maxPercentage = -100, start = 0, total, percent = 0, speedTimeout, startMomentum = 0, restingPos = 0, slideCount, startPos, remaining, distance, speed, remaining = 0;

		transition.setUp = function() {

			slideCount = publicF.slideCount();

			core['elem']['slides'].wrapAll('<div class="carousel" />');

			core['elem']['carousel'] = core['self'].find('.carousel');
			core['elem']['carousel'].css({

				'width' : ((100 * slideCount) / visibleSlides) + '%',
				'float' : 'left',
				'position' : 'relative',
				'transform' : 'translate3d(0%, 0, 0)'

			});

			distance = (core['elem']['carousel'].width() / slideCount);
			
			core['elem']['slides'].css({

				'width' : (100 / slideCount) - spacing + '%',
				'display' : 'block'

			});

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				slide.css({

					'left' : (100 / slideCount) * i + '%',
					'position' : (i === 0 ? 'relative' : 'absolute'),
					'top' : '0px',
					'float' : (i === 0 ? 'left' : 'none')

				});

			}

			if(core['ins'].cssSupport === true) {

				core['elem']['inner'].on('touchstart mousedown', function(e) {
					
					cancelAnimationFrame(transition.animate);
					core.objs['controls'].pause();

					restingPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);
					e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

					start = e.pageX;
					startMomentum = e.pageX;

					$('body').addClass('no-select');

					core['elem']['carousel'].addClass('active');

					$(document).on('touchmove mousemove', function(e) {

						e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

						if(core['elem']['carousel'].hasClass('active')) {

							transition.coordinate(e.pageX);

						}

					});

					$(document).on('touchend touchcancel mouseup', function(e) {
						
						e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

						if(core['elem']['carousel'].hasClass('active')) {

							restingPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);
							start = e.pageX;

							core['elem']['carousel'].removeClass('active');
							clearTimeout(speedTimeout);

							var distance = Math.abs(e.pageX - startMomentum),
								speed = Math.round((distance / 75) * 100) / 100;

							$(document).unbind('touchmove mouseup touchend touchcancel');

							$('body').removeClass('no-select');
							
						}

					});

				});

			}

		}

		transition.progress = function(startTime, then) {

			// inc = (inc ? inc : 0);

			var now = Date.now(),
       			delta = now - then,
       			current = now - startTime;

       		var distance = (100 / slideCount);

       		restingPos-=0.2;

       		transition.slidePos();
       		transition.coordinate();

       		core['elem']['carousel'].css({

				'transform' : 'translate3d('+ restingPos +'%, 0, 0)'

			});


			// var target = Math.round(Math.abs((startPos - distance) + (distance / 2))),
			// 	target = (target > core['elem']['carousel'].width() / 2 ? (distance / 2) : target);
			// 	increment = (transition.easeOut(current, 0, distance, core['options'].speed) - inc) / 2;
			// 	inc = Math.round(transition.easeOut(current, 0, distance, core['options'].speed) * 1000) / 1000;
			// 	remaining = Math.floor((restingPos + target) * 100) / 100;

			// console.log(distance);

       		// pos -= increment;

			// restingPos = Math.round(pos * 100) / 100;

			transition.animate = requestAnimationFrame(function() {

				// transition.coordinate(restingPos);

				if(remaining === 0.5) {

					cancelAnimationFrame(transition.animate);
					return;
					
				}

				transition.progress(startTime, now);

			});

		}

		transition.forward = function(difference) {

			var visibleSlides = visibleSlides,
				speed = (distance / (core['options'].speed * 2) * core['options'].slideBy);
				
			distance = (core['elem']['carousel'].width() / slideCount);

			if(core['ins'].cssSupport === true) {

				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;

					cancelAnimationFrame(transition.animate);
					transition.progress(Date.now(), Date.now(), true);

				});

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

					'left' : '-' + ((100 * difference) + ((spacing * slideCount * difference)) / visibleSlides) + '%'

				}, core['options'].speed, callback);				

			}

		}

		transition.back = function(difference) {

			if(core['ins'].cssSupport === true) {

				if(publicF.currentSlide() === (publicF.slideCount -1)) restingPos = 0.001;

				transition.animate = requestAnimationFrame(function() {

					cancelAnimationFrame(transition.animate);
					transition.progress(restingPos, Date.now(), Date.now());

				});

			} else {

				for(var i = 0; i > difference; i--) {

					publicF.reIndex();
					core['elem']['slides'].eq(slideCount -1).prependTo(core['elem']['carousel']);

				}
				
				core['elem']['carousel'].css({

					'left' : ((100 * difference) - ((spacing * slideCount) * Math.abs(difference))) / visibleSlides + '%'

				});

				core['elem']['carousel'].animate({

					'left' : '0%'

				}, core['options'].speed);

			}

		}

		transition.adjustments = function(pos) {

			pos = (Math.round(pos * 1000) / 1000);

			core['elem']['carousel'].css({

				'transform' : 'translate3d('+ pos +'%, 0, 0)'

			});

			transition.slidePos(pos);

		}

		transition.slidePos = function() {

			for(var i = 0; i < visibleSlides; i++) {

				var slide = core['elem']['slides'].eq(i);

				if(restingPos < -Math.abs((100 / slideCount) * (i + 1)) && restingPos <= 0) {

					var finalPos = ((100 / slideCount) * i) - maxPercentage;

				} else {

					var finalPos = (100 / slideCount) * i;

				}

				slide.css({

					'left' : finalPos + '%'

				});

			}

		}

		transition.coordinate = function() {

			if(Math.max(restingPos, maxPercentage) === maxPercentage) {

				restingPos = 0;

			} else if(restingPos > 0) {

				restingPos = maxPercentage;

			}

		}

		transition.easeOut = function(t, b, c, d) { 

			var ts = (t /= d) * t,
				tc = ts * t;
				
			return Math.round((b + c * (tc + -3 * ts + 3 * t) * 100) / 100);

		}

	}

});