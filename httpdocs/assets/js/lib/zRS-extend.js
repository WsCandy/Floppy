$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].slideSpacing,
			visibleSlides = core['options'].visibleSlides,
			publicF = core.ins['publicF'],
			maxPercentage = -100, start = 0, beginning = 0, startingSlide = 0, restingPos = 0, slideCount, startPos, remaining = 0, currentDirection, slideWidth,
			dragging = false,
			isTouch = window.isTouch = ("ontouchstart" in document.documentElement);

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
			slideWidth = ((100 / slideCount) + (spacing / visibleSlides));
			
			core['elem']['slides'].css({

				'width' : slideWidth - spacing + '%',
				'display' : 'block'

			});

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				slide.css({

					'left' : (slideWidth) * i + '%',
					'position' : (i === 0 ? 'relative' : 'absolute'),
					'top' : '0px',
					'float' : (i === 0 ? 'left' : 'none')

				});

			}

			transition.dragBindings();

		}

		transition.progress = function(startTime, then, distance, direction) {

			var now = Date.now(),
       			delta = now - then,
       			current = now - startTime;

       		var	increment = Math.round(transition.easeOut(current, 0, distance, core['options'].speed) * 10000) / 10000;

       		currentDirection = direction;
       		remaining = distance - increment;
       		restingPos = (direction === 'back' ? Math.abs(increment) + startPos : -Math.abs(increment) + startPos);

       		transition.coordinate();
       		transition.slidePos();

       		core['elem']['carousel'].css({

				'transform' : 'translate3d('+ Math.round(restingPos * 1000) / 1000 +'%, 0, 0)'

			});

			transition.animate = requestAnimationFrame(function() {

				if(Math.min(increment, distance) === distance) {

					cancelAnimationFrame(transition.animate);
					return;
					
				}

				transition.progress(startTime, now, distance, direction);

			});

		}

		transition.forward = function(difference) {

			var visibleSlides = visibleSlides,
				distance = (currentDirection != 'forward' ? ((Math.round((slideWidth * difference) * 10000) / 10000) - remaining) : ((Math.round((slideWidth * difference) * 10000) / 10000) + remaining));

			if(core['ins'].animationFrameSupport === true) {

				cancelAnimationFrame(transition.animate);
				
				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;
					transition.progress(Date.now(), Date.now(), distance, 'forward');

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

			difference = Math.abs(difference);

			var distance = (currentDirection != 'back' ? ((Math.round((slideWidth * difference) * 10000) / 10000) - remaining) : ((Math.round((slideWidth * difference) * 10000) / 10000) + remaining));

			if(core['ins'].animationFrameSupport === true) {

				cancelAnimationFrame(transition.animate);

				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;
					transition.progress(Date.now(), Date.now(), distance, 'back');

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

		transition.slidePos = function() {

			for(var i = 0; i < visibleSlides; i++) {

				var slide = core['elem']['slides'].eq(i);

				if(restingPos < -Math.abs(slideWidth * (i + 1)) && restingPos <= 0) {

					var finalPos = ((slideWidth * i) - maxPercentage) + ((spacing / visibleSlides) * slideCount);

				} else {

					var finalPos = slideWidth * i;

				}

				if(Math.floor((parseInt(slide.css('left')) / core['elem']['carousel'].width()) * 100) != Math.floor(finalPos)) {

					slide.css({

						'left' : finalPos + '%'

					});
					
				}

			}

		}

		transition.coordinate = function() {

			for(var i = 0; i < slideCount; i++) {

				if(restingPos < (maxPercentage - ((spacing / visibleSlides) * slideCount))) {

					restingPos-=(maxPercentage - ((spacing / visibleSlides) * slideCount));

				} else if(restingPos > 0) {

					restingPos+=(maxPercentage - ((spacing / visibleSlides) * slideCount));

				}				

			}

		}

		transition.easeOut = function(t, b, c, d) { 

			var ts = (t /= d) * t,
				tc = ts * t;
				
			return b + c * (tc + -3 * ts + 3 * t);

		}

		transition.dragBindings = function() {

			var events = this;

			events.init = function() {

				if(core['ins'].animationFrameSupport === true) {

					core['elem']['inner'].on('touchstart mousedown', events.start);

				}

			}

			events.start = function(e) {
                
                if(!isTouch || core.options.allowScrolling === false) {
                        
					  e.preventDefault();			

				}

				e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

				start = (e.pageX / core['elem']['carousel'].width() * 100);
				startingPos = (e.pageX / core['elem']['carousel'].width() * 100);
				startingSlide = publicF.currentSlide();
				beginning = restingPos;

				core.objs['controls'].pause();
				cancelAnimationFrame(transition.animate);
				core['elem']['carousel'].addClass('active');

				$(document).on('touchmove mousemove', events.move);
				$(document).on('touchend touchcancel mouseup', events.end);
				core.elem['carousel'].find('a').on('click', function(e) {

					if(dragging === true) {

						e.preventDefault();
						dragging = false;
						return false;

					}
					
				});

			}

			events.move = function(e) {				

				if(!isTouch || core.options.allowScrolling === false) {
                        
					   e.cancelBubble=true;
					   e.stopPropagation();					

				}

				e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

				if(core['elem']['carousel'].hasClass('active')) {

					var increment = start - ((e.pageX / core['elem']['carousel'].width()) * 100),
						currentPos = Math.abs(Math.round(restingPos * 1000) / 1000),
						slide = currentPos / slideWidth,						
						moved = beginning - restingPos;

					var slideValue = Math.round(slide);

					moved = (moved > (slideWidth * visibleSlides) && restingPos != 0 ? moved + maxPercentage : moved);
					restingPos-=increment;

					transition.coordinate();
					transition.slidePos();;

					if(moved < 0) {

						var slideNo = slideValue -1; 

						core.objs['slides'].currentSlide = slide % 1 < 0.95 ? Math.floor(slide) : Math.ceil(slide);

					} else if(moved > 0) {

						var slideNo = slideValue + visibleSlides;
							slideNo = (slideNo >= slideCount ? slideNo - slideCount : slideNo);

						core.objs['slides'].currentSlide = slide % 1 > 0.05 ? Math.ceil(slide) : Math.floor(slide);

					}				


					core.objs['transition'].update(0);
					core.objs['transition'].swapImg(core['elem']['slides'].eq(slideNo), null, 1, true);

					core['elem']['carousel'].css({

						'transform' : 'translate3d('+ Math.round(restingPos * 1000) / 1000 +'%, 0, 0)'

					});
					
					start = start-=increment;

				}
				
			}

			events.end = function(e) {

				e.cancelBubble=true;
				e.stopPropagation();

				e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

				if(core['elem']['carousel'].hasClass('active')) {

					core['elem']['carousel'].removeClass('active');
					
					var endingPos = (e.pageX / core['elem']['carousel'].width() * 100),
						endPos = restingPos,
						target = slideWidth * publicF.currentSlide(),
						moved = endingPos - startingPos,
						traveled = beginning - endPos,
						distance = slideWidth,
						difference = publicF.currentSlide() - startingSlide,
						loop = (moved > (100 / slideCount)) ? true : false;

					startPos = restingPos;

					distance = (target - traveled) + beginning;
					direction = (moved > 0 ? 'back' : 'forward');

					if(Math.abs(moved) > 0.2) {

						dragging = true;						

					}


					// if(startingSlide == publicF.currentSlide()) {

					// 	direction = (moved < 0 ? 'back' : 'forward');
					// 	distance = (direction === 'back' ? (distance - remaining) : (publicF.currentSlide() === 0 ? (distance + 100) : distance) + remaining);

					// 	console.log(distance);

					// } else {

						if(distance < -Math.abs(slideWidth * (slideCount -1))) {

							distance+= (slideWidth * (slideCount));

						};
					// }

					transition.progress(Date.now(), Date.now(), Math.abs(distance), direction);

					$(document).unbind('touchmove mouseup touchend touchcancel');
					
				}

			}

			events.init();

		}

	}

});