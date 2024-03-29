$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].slideSpacing,
			publicF = core.ins['publicF'],
            visibleSlides = core.options.visibleSlides,
            lastMove = 0,
			maxPercentage = -100, start = 0, beginning = 0, startingSlide = 0, restingPos = 0, slideCount, startPos, remaining = 0, currentDirection, slideWidth, offset,
			dragging = false,
            moving = false,
			isTouch = window.isTouch = ("ontouchstart" in document.documentElement),
            active = false;

		transition.setUp = function() {
        
			slideCount = publicF.slideCount();

			core['elem']['slides'].wrapAll('<div class="carousel" />');
			core['elem']['carousel'] = core['self'].find('.carousel');
            
            $(window).on('resize', function() {
                
                if(core.ins.animationFrameSupport) {
                    
                    window.requestAnimationFrame(transition.setVisibleSlides);
                    
                } else {
                    
                    transition.setVisibleSlides();
                    
                }
                
            });
            
            transition.setVisibleSlides(true);
			transition.dragBindings();

		}
        
        transition.setVisibleSlides = function(initial) {
            
            var currentVisible = core.options.visibleSlides;
            
            core['objs'].transition.checkVisible();
            
            visibleSlides = core.options.visibleSlides;
            
            if(visibleSlides === currentVisible && initial !== true) return;
            
			distance = Math.round((core['elem']['carousel'].width() / slideCount) * core.options.decimal) / core.options.decimal;
			slideWidth = Math.round(((100 / slideCount) + (spacing / visibleSlides)) * core.options.decimal) / core.options.decimal;
			
			core['elem']['slides'].css({

				'width' : slideWidth - spacing + '%',
				'display' : 'block'

			});
            
            core['elem']['carousel'].css({

				'width' : (Math.round(((100 * slideCount) / visibleSlides) * core.options.decimal) / core.options.decimal) + '%',
				'position' : 'relative'

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
            
            for(var i = 0; i < visibleSlides; i++) {
                
                core.objs.transition.swapImg(core.elem['slides'].eq(i), 'forward', 1, true);
                
            }
            
            offset = (slideWidth * (core.options.visibleSlides % 1) / 2);
            
            transition.jumpTo(0);
            
        }
        
        transition.jumpTo = function(target) {
            
            var carouselPosition = (Math.round(-Math.abs((slideWidth) * (target)) * core.options.decimal) / core.options.decimal);
            
            restingPos = carouselPosition;            
                                
            if(core.options.alignment === 'center') {
                
                 restingPos += offset;
                
            }
            
             if(typeof core.options['pre_trans_callback'] === 'function') {

                core.options['pre_trans_callback']({

                    current: core.elem['slides'].eq(core.objs['slides'].currentSlide)

                });

            }
            
            transition.coordinate();
       		transition.slidePos();
            
            core.objs.transition.swapImg(core.elem['slides'].eq(target), 'forward', 1, true);
            core.objs['slides'].currentSlide = target;            
            
            if(core['ins'].animationFrameSupport === true) {
                
                core['elem']['carousel'].css({

                    'transform' : 'translate3d('+restingPos+'%, 0, 0)'

                });
                
            } else {
                
                core['elem']['carousel'].css({

                    'left' : '-'+(((100 + (core.options.slideSpacing * (slideCount / visibleSlides))) / visibleSlides) * core.objs['slides'].currentSlide)+'%'
                    
				});
                
            }
            
            if(core.elem['pager']) {
                    
                core.objs['pager'].update();
                
            }
            
            core.objs['transition'].after();
            
        }

		transition.progress = function(startTime, then, distance, direction) {

			var now = Date.now(),
       			delta = now - then,
       			current = now - startTime;
            
            moving = true;

       		var	increment = Math.round(transition.easeOut(current, 0, distance, core['options'].speed) * core.options.decimal) / core.options.decimal;

       		currentDirection = direction;
       		remaining = distance - increment;
       		restingPos = Math.round((direction === 'back' ? Math.abs(increment) + startPos : -Math.abs(increment) + startPos) * core.options.decimal) / core.options.decimal;

       		transition.coordinate();
       		transition.slidePos();

       		core['elem']['carousel'].css({

				'transform' : 'translate3d('+ restingPos +'%, 0, 0)'

			});

			transition.animate = requestAnimationFrame(function() {
                
                core.objs['slides'].currentSlide = Math.round(Math.abs(restingPos) / slideWidth);
                core.objs['slides'].currentSlide = core.objs['slides'].currentSlide === slideCount ? 0 : core.objs['slides'].currentSlide;           
                
                if(core.elem['pager']) {
                    
                    core.objs['pager'].update();
                }                
                
				if(Math.min(increment, distance) === distance) {
                    
                    moving = false;
                    
                    restingPos = (-Math.abs(slideWidth * core.objs['slides'].currentSlide));
                    
                    if(core.options.alignment === 'center') {
                
                         restingPos += offset;

                    }
                    
       		        transition.coordinate();
                    transition.slidePos();
                    
                    core['elem']['carousel'].css({

                        'transform' : 'translate3d('+ restingPos +'%, 0, 0)'

                    });
                    
                    core.objs['transition'].swapImg(core['elem']['slides'].eq(core.objs['slides'].currentSlide), direction, 1, true);                    
                    core.objs['transition'].after();
                    
					cancelAnimationFrame(transition.animate);
					return;
					
				}

				transition.progress(startTime, now, distance, direction);

			});

		}

		transition.forward = function(difference) {

			var distance = (currentDirection != 'forward' ? ((Math.round((slideWidth * difference) * core.options.decimal) / core.options.decimal) - remaining) : ((Math.round((slideWidth * difference) * core.options.decimal) / core.options.decimal) + remaining));
            
			if(core['ins'].animationFrameSupport === true) {

				cancelAnimationFrame(transition.animate);
				
				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;
					transition.progress(Date.now(), Date.now(), distance, 'forward');

				});

			} else {

				core['elem']['carousel'].animate({

                    'left' : '-'+(((100 + (core.options.slideSpacing * (slideCount / visibleSlides))) / visibleSlides) * core.objs['slides'].currentSlide)+'%'
                    
				}, core.options.speed);

			}

		}

		transition.back = function(difference) {

			difference = Math.abs(difference);

			var distance = (currentDirection != 'back' ? ((Math.round((slideWidth * difference) * core.options.decimal) / core.options.decimal) - remaining) : ((Math.round((slideWidth * difference) * core.options.decimal) / core.options.decimal) + remaining));

			if(core['ins'].animationFrameSupport === true) {

				cancelAnimationFrame(transition.animate);

				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;
					transition.progress(Date.now(), Date.now(), distance, 'back');

				});

			} else {

				core['elem']['carousel'].animate({				   

                    'left' : '-'+(((100 + (core.options.slideSpacing * (slideCount / visibleSlides))) / visibleSlides) * core.objs['slides'].currentSlide)+'%'
                    
				}, core.options.speed);

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

					restingPos-=(Math.round((maxPercentage - ((spacing / visibleSlides) * slideCount)) * core.options.decimal) / core.options.decimal);

				} else if(restingPos > 0) {

					restingPos+=(Math.round((maxPercentage - ((spacing / visibleSlides) * slideCount)) * core.options.decimal) / core.options.decimal);
                    
				}				

			}

		}

		transition.easeOut = function(t, b, c, d) { 

			var ts = (t /= d) * t,
				tc = ts * t;
				
			return b + c * (tc + -3 * ts + 3 * t);

		}
        
        transition.scrolling = false;

		transition.dragBindings = function() {

			var events = this;

			events.init = function() {

				if(core['ins'].animationFrameSupport === true) {

                    if(core.options['draggable'] === true) {
                    
                        core['elem']['inner'].on('mousedown', events.start);
                        
                    }
                    
					core['elem']['inner'].on('touchstart', events.start);
                                    
                    if(isTouch) {
                        
                        $(window).on('scroll', function() {

                            window.requestAnimationFrame(events.scrollStart);                        

                        });
                        
                    }                   

				}

			}
            
            events.scrollTimer;
            
            events.scrollStart = function() {
                
                clearTimeout(events.scrollTimer);
                events.scrollTimer = setTimeout(events.scrollHandler, 400);               
                
                transition.scrolling = true;          
                
            }
            
            events.scrollHandler = function() {
                
                transition.scrolling = false;
                
            }

			events.start = function(e) {

                core.elem['carousel'].find('a').on('click', function(e) {
                    
                    if(dragging === true && !isTouch) {
                        
                        e.preventDefault();
                        dragging = false;
                        return false;

                    }

                });
                
                active = false;                
                core['elem']['carousel'].addClass('active');

                e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

                if(e.pageX === undefined) {

                    var posX = e.touches[0].pageX;

                } else {

                    var posX = e.pageX;

                }
                
                
                if(transition.scrolling === true) {

                    return;

                }

                if(!isTouch || dragging === true || moving === true) {

                      e.preventDefault();

                }

                start = (posX / core['elem']['carousel'].width() * 100);
                startingPos = (posX / core['elem']['carousel'].width() * 100);
                startingSlide = publicF.currentSlide();
                beginning = restingPos;

                core.objs['controls'].pause();
                cancelAnimationFrame(transition.animate);
                
                if(core.options['draggable'] === true) {
                
                    $(document).on('mousemove', events.move);                    
                    $(document).on('mouseup', events.end);
                    
                }

                $(document).on('touchmove', events.move);                    
                $(document).on('touchend touchcancel', events.end);

			}

			events.move = function(e) {

				e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;
                
                if(e.pageX === undefined) {
                    
                    var posX = e.touches[0].pageX;
                    
                } else {
                    
                    var posX = e.pageX;
                    
                }

                
                if(!isTouch || transition.scrolling === true) {
                        
					   e.cancelBubble=true;
					   e.stopPropagation();

				}
            
                lastMove = posX;
                
				if(core['elem']['carousel'].hasClass('active')) {

					var increment = start - ((posX / core['elem']['carousel'].width()) * 100),
						currentPos = Math.abs(Math.round(restingPos * core.options.decimal) / core.options.decimal),
						slide = currentPos / slideWidth,						
						moved = beginning - restingPos,
				        slideValue = Math.round(slide);
                        
                    active = true;

					moved = (moved < (maxPercentage) ? (moved + maxPercentage) : moved);
                    moved = ((moved > Math.abs(maxPercentage) || moved > ((slideCount - 1) * slideWidth)) ? ((-Math.abs(moved) * visibleSlides) + maxPercentage) : moved);
                                        
					restingPos-=increment;

					transition.coordinate();
					transition.slidePos();
                    
					if(moved < 0) {

						var slideNo = slideValue -1;
                        
                        if(core.options.visibleSlides % 1 !== 0 && core.options.alignment === 'center') {
                                
                            slideNo -=1;

                        }

					} else if(moved > 0) {

						var slideNo = slideValue + Math.ceil(visibleSlides);
				
                        slideNo = (slideNo >= slideCount ? slideNo - slideCount : slideNo);

					}
                    
                    if(core.options['delayedLoad'] != true) {
                        
                        core.objs['transition'].swapImg(core['elem']['slides'].eq(slideNo), null, 1, true);
                        
                    }
                    
                     if(typeof core.options['pre_trans_callback'] === 'function') {
                         
                        core.options['pre_trans_callback']({

                            current: core.elem['slides'].eq(core.objs['slides'].currentSlide)

                        });

                    }
                    
					core['elem']['carousel'].css({

						'transform' : 'translate3d('+ Math.round(restingPos * core.options.decimal) / core.options.decimal +'%, 0, 0)'

					});
					
					start = start-=increment;

				}
				
			}

			events.end = function(e) {

                var endingPos = (lastMove / core['elem']['carousel'].width() * 100),
                    moved = endingPos - startingPos,
                    difference,
                    distance = (Math.round(slideWidth * core.options.decimal) / core.options.decimal);
                
                if(Math.abs(moved) > 0.2) {

                    dragging = true;

                }
                
                e.cancelBubble=true;
                e.stopPropagation();

				e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;
                
                if(active === false) {
                    
                    core['elem']['carousel'].removeClass('active');
                    
                }
                
				if(core['elem']['carousel'].hasClass('active')) {
                    
					core['elem']['carousel'].removeClass('active');					
                                        
					startPos = restingPos;
                                    
					direction = (moved > 0 ? 'back' : 'forward');			
                    
                    if(direction === 'forward') {
                        
                        distance = (currentDirection === 'forward' ? (distance + moved + remaining) : (distance + moved - remaining));
                        
                    } else {
                        
                        distance = (currentDirection === 'back' ? (distance - moved + remaining) : (distance - moved - remaining));
                        
                    }
                    
                    if(distance < 0) {
                        
                        distance += (slideWidth * (Math.ceil(Math.abs(distance) / slideWidth)));
                        
                    }
                    
                    distance = (Math.round(distance * core.options.decimal) / core.options.decimal);
                                                                                
					transition.progress(Date.now(), Date.now(), Math.abs(distance), direction);
					
				}
                
				$(document).unbind('touchmove mouseup touchend touchcancel');
                
                if(isTouch) {
                    
                    dragging = false;
                    
                }
                
                core.objs['controls'].play();

			}

			events.init();

		}

	}

});