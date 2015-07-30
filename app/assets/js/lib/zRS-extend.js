$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].slideSpacing,
			visibleSlides = core['options'].visibleSlides,
			maxPercentage, start = 0, total, percent = 0, speedTimeout, startMomentum = 0, restingPos = -0.0001, slideCount, startPos;

		transition.setUp = function() {

			slideCount = core.ins['publicF'].slideCount();
			maxPercentage = -Math.abs((((100 / slideCount) + ((spacing) / (visibleSlides - (visibleSlides === 1 ? 0 : 1)))) * slideCount));

			core['elem']['slides'].wrapAll('<div class="carousel" />');

			core['elem']['carousel'] = core['self'].find('.carousel');
			core['elem']['carousel'].css({

				'width' : ((100 * slideCount) / visibleSlides) + '%',
				'float' : 'left',
				'position' : 'relative',
				'transform' : 'translate3d(0%, 0, 0)'

			});
			
			core['elem']['slides'].css({

				'width' : ((1 / slideCount) * 100) - (visibleSlides === 1 ? 0 : spacing) + '%',
				'display' : 'block'

			});

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				slide.css({

					'left' : ((100 / slideCount) * i) + ((spacing * i) / (visibleSlides === 1 ? visibleSlides : (visibleSlides - (visibleSlides === 1 ? 0 : 1)))) + '%',
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

		transition.progress = function(pos, startTime, interval, snap, inc) {

			inc = (inc ? inc : 0);

			var now = Date.now(),
				then = interval;
       			delta = now - then,
       			current = now - startTime;

			percent = ((pos / core['elem']['carousel'].width()) * 100) * visibleSlides;
       	
			var distance = (core['elem']['slides'].width() + (core['elem']['carousel'].width() * ((((spacing * 1) / (visibleSlides - (visibleSlides === 1 ? 0 : 1))) * visibleSlides) / 100)));

       		console.log(distance)

			var target = distance * core.ins['publicF'].currentSlide() / 2,
				distance = ((target + startPos) * 2),
				speed = (distance / (core['options'].speed * 2) * core['options'].slideBy),
				increment = (transition.easeOut(current, 0, distance, core['options'].speed) - inc) / 2;
				inc = transition.easeOut(current, 0, distance, core['options'].speed);

       		pos -= (core['options'].direction === 'back' ? (-Math.abs(increment * core['options'].slideBy)) : (increment * core['options'].slideBy));


       		// pos = (target + pos) / 2;

			transition.animate = requestAnimationFrame(function() {

				restingPos = pos;
				then = now;

				transition.coordinate(restingPos, snap);

				if(Math.min(current, core['options'].speed) === core['options'].speed) {

					var finalPos = -Math.abs((((100 / slideCount) * 1) + ((spacing * 1) / (visibleSlides - (visibleSlides === 1 ? 0 : 1)))) * core.ins['publicF'].currentSlide());

					transition.adjustments(finalPos, snap);
					cancelAnimationFrame(transition.animate);

					var matrix = parseInt(core['elem']['carousel'].css('transform').split(',')[4]) / 2;

					if(core.ins['publicF'].currentSlide() === 0) {

						restingPos = (core['options'].direction === 'back' ? 0.001 : -0.001);

					} else if(matrix < 0) {

						restingPos = matrix;

					}

					return;
					
				}

				transition.progress(restingPos, startTime, now, snap, inc);

			});

		}

		transition.forward = function(difference) {

			var visibleSlides = visibleSlides,
				slideCount = slideCount;

			if(core['ins'].cssSupport === true) {

				if(core.ins['publicF'].currentSlide() === 1) restingPos = -0.001;

				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;
					cancelAnimationFrame(transition.animate);
					transition.progress(restingPos, Date.now(), Date.now(), true);

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

				if(core.ins['publicF'].currentSlide() === (core.ins['publicF'].slideCount -1)) restingPos = 0.001;

				transition.animate = requestAnimationFrame(function() {

					cancelAnimationFrame(transition.animate);
					transition.progress(restingPos, Date.now(), Date.now(), true);

				});

			} else {

				for(var i = 0; i > difference; i--) {

					core.ins['publicF'].reIndex();
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

		transition.adjustments = function(pos, snap) {

			var finalPos = -Math.abs((((100 / slideCount) * 1) + ((spacing * 1) / (visibleSlides - (visibleSlides === 1 ? 0 : 1)))) * core.ins['publicF'].currentSlide());

			pos = (Math.round(pos * 100) / 100);

			if(core.ins['publicF'].currentSlide() === 0 && pos === Math.abs(maxPercentage)) {

				pos = 0;
				finalPos = 0;

			}

			if(core['options'].direction === 'back') {

				core['elem']['carousel'].css({

					'transform' : 'translate3d('+ (snap === true && pos != -0 ? (Math.min(pos, finalPos)) : pos) +'%, 0, 0)'

				});

			} else {

				core['elem']['carousel'].css({

					'transform' : 'translate3d('+ (snap === true && Math.max(pos, finalPos) != -0 ? (Math.max(pos, finalPos)) : pos) +'%, 0, 0)'

				});

			}			

			transition.slidePos(pos);

		}

		transition.slidePos = function(pos) {

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				if(pos < -Math.abs(((100 / slideCount) * (i + 1)) + ((spacing * (i + 1)) / (visibleSlides - (visibleSlides === 1 ? 0 : 1)))) && pos <= 0) {

					var finalPos = ((100 / slideCount) * (i + slideCount)) + ((spacing * (i + slideCount)) / (visibleSlides - (visibleSlides === 1 ? 0 : 1)))

				} else {

					var finalPos = ((100 / slideCount) * i) + ((spacing * i) / (visibleSlides - (visibleSlides === 1 ? 0 : 1)))

				}

				slide.css({

					'left' : finalPos + '%'

				});

			}

		}

		transition.coordinate = function(posX, snap) {

			total = (posX - (start - (restingPos ? restingPos : 0)));
			percent = (total / core['elem']['carousel'].width()) * 100;

			if(Math.max(percent, maxPercentage) === maxPercentage) {

				percent = 0;

			}

			if(percent === 0) {

				percent = ((total / core['elem']['carousel'].width()) * 100) - maxPercentage;

			} else if(percent > 0) {

				percent = ((total / core['elem']['carousel'].width()) * 100) + maxPercentage;

			}

			speedTimeout = setTimeout(function() {

				startMomentum = posX;

			}, 75);

			transition.adjustments(percent, snap);

		}

		transition.easeOut = function(t, b, c, d) { 

			var ts = (t /=d) * t,
				tc = ts * t;
			return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 *t);

		}

	}

});