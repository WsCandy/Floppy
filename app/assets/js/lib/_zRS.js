;(function() {

	'use strict';

	var version = '3.0a',
		name = 'zRS',
		extendableObjs = {

			transition: {},
			publicF: {},
			pager: {}

		};

	$.fn.zRS3 = function(settings, params) {

		if(!this[0] && settings == 'extend') {

			!extendableObjs[params.name] ? extendableObjs[params.name] : extendableObjs[params.name][params.handle] = {

				core: params.extend,
				handle: params.handle

			};

			return;

		}
		
		var results = [];

		for(var i = 0; i < this.length; i++) {

			var self = $(this[i]);

			if(!self.data('ins')) {

				if(typeof settings == 'string' && console) {

					console.error('['+ name +' '+ version +'] - not running, try firing methods after initialisation'); 
					continue;

				}

				var ins = new zRS_core(self, settings);
				
				for(var customObj in extendableObjs) {

					if(ins[customObj]) continue;
					ins[customObj] = extendableObjs[customObj].core;
					
				}

				ins.init();

				self.data('ins', ins);

			} else {

				var ins = self.data('ins');

				if(ins['publicF'][settings]) {

					if(this.length > 1) {

						results.push(ins['publicF'][settings](params));

					} else {

						return ins['publicF'][settings](params);
						
					}

				} else {

					if(console) {
					
						console.error('['+ name +' '+ version +'] - "'+ settings +'" is not a public method here\'s a nice list:');
						return ins['publicF'];

					}

				}

			}

		}

		if(results.length >= 1) return results;

	}

	var zRS_core = function(self, settings) {

		var ins = this;		
			ins.defaults = {

				transition : 'fade',
				textFade : false,
				fluidHeight : false,
				direction : 'forward',
				speed : 1500,
				delay: 6000,
				slideBy: 1,
				slideSpacing: 0,
				pager: null,
				visibleSlides: 1,
				trans_callback: null,
				pre_trans_callback: null,
                allowScrolling: false

			};
		
		var options = $.extend(ins.defaults, settings), objs = {}, elem = {},
			transEnd;
		
		ins.cssPrefix = ['webkit', 'moz', 'o', 'ms', 'transition'];
		ins.animationFrameSupport = window.requestAnimationFrame !== undefined;

		var setUp = {

			init: function() {

				setUp.defineModules();

				for(var obj in objs) {

					if(!objs[obj].setUp) continue;

					try {

						objs[obj].setUp();
						
					} catch(error) {

						objs['misc'].report('group', error['message'] + ', tracer below...');
						console.info(error['stack'].split('\n')[1]);
						console.groupEnd();

					}

				}

				if(objs['slides'].count() > 1) {

					objs['controls'].play();

				}

				$(window).on('blur', objs['controls'].pause);
				$(window).on('focus', objs['controls'].play);
				$(window).on('load', function() {

					if(options['transition'] !== 'fade' && ins.animationFrameSupport === true) {

						elem['inner'].css({

							'height' : 'auto'

						});
						
					}

				});

			},

			defineModules: function() {

				var modules = ['misc', 'inner', 'slides', 'transition', 'pager', 'controls'];

				for(var i = 0; i < modules.length; i++) {

					objs[modules[i]] = new ins[modules[i]]();

				}

				for(var customObj in extendableObjs) {

					var data = {

						self: self,
						ins: ins,
						objs: objs,
						elem: elem,
						options: options

					}

					if(customObj === 'publicF') {

						for(var extend in extendableObjs[customObj]) {

							ins.publicF[extendableObjs[customObj][extend].handle] = extendableObjs[customObj][extend].core;							

						}

					} else if(!objs[customObj]) {

						objs[customObj] = new extendableObjs[customObj].core(data);

					} else {

						for(var extend in extendableObjs[customObj]) {

							objs[customObj][extendableObjs[customObj][extend].handle] = (typeof objs[customObj][extendableObjs[customObj][extend].handle] !== 'function' ? new extendableObjs[customObj][extend].core(data) : extendableObjs[customObj][extend].core);

						}

					}

				}

			}

		}

		ins.publicF = {

			slideCount : function() {

				return objs['slides'].count();

			},

			pause : function() {

				objs['controls'].pause();

			},

			play : function() {

				objs['controls'].play();

			},

			next : function() {

				objs['transition'].before(options.transition, 'forward');

			},

			prev: function() {

				objs['transition'].before(options.transition, 'back');

			},

			currentSlide: function() {

				return objs['slides'].currentSlide;

			},

			reIndex: function() {

				return objs['slides'].reIndex();

			},

			goTo: function(target) {

				objs['transition'].goTo(target);

			}

		}

		ins.misc = function() {

			var method = this;

			method.report = function(type, message) {

				if(console)	console[type]('['+ name +' '+ version +'] - ' + message);

			}

		}

		ins.inner = function() {

			var method = this;

			method.setUp = function() {

				elem['inner'] = self.find('.inner-slider');
				elem['inner'].css({

					'position' : 'relative',
					'width' : '100%',
					'overflow' : 'hidden'

				});

			}

		}

		ins.slides = function() {

			var method = this;

			method.setUp = function() {

				elem['slides'] = elem['inner'].children();
				elem['slides'].addClass('zRS--slide');

			}

			method.count = function() {

				objs['slides'].reIndex();

				return elem['slides'].length;

			}

			method.reIndex = function() {

				elem['slides'] = self.find('.zRS--slide');				

			}

			this.currentSlide = 0;

		}

		ins.transition = function() {

			var transition = this;

			transition.count = 0;
			transition.opacity = 0;
			transition.textOpacity = 1;

			transition.setUp = function() {

				objs['transition'][options.transition].setUp();
				objs['transition'].procedural('initial');

				objs['transition'].after();

			}

			transition.procedural = function(target, difference, direction) {

				difference = !difference ? options.slideBy : difference;
				target = !target ? objs['transition'].target(difference) : target;

				if(target == 'initial') {

					for(var i = 0; i < options.visibleSlides; i++) {

						transition.swapImg(elem['slides'].eq(i), difference, direction, 'initial');

					}

					return;

				}

				transition.count = Math.abs(difference);

				for(var i = 0; (difference < 0 ? i > difference : i < difference); (difference < 0 ? i-- : i++)) {

					if(ins.animationFrameSupport === true) {

						if(direction !== 'back') {

							var slide = objs['slides'].currentSlide + options['visibleSlides'] - (i + 1);
								slide = (slide >= objs['slides'].count()) ? slide - objs['slides'].count() : slide;

						} else {

							var slide = objs['slides'].currentSlide + i;

						}

						transition.swapImg(elem['slides'].eq(slide), direction, difference);

					} else {						

						transition.swapImg(elem['slides'].eq((difference < 0 ? Math.abs(i) : (i + difference) - (options.visibleSlides === difference ? 0 : difference - options.visibleSlides))), direction, difference);

					}

				}
				
			}

			transition.swapImg = function(slide, direction, difference, initial) {

				var images = slide.is('img') ? slide : slide.find('img');

				if(images.length === 0 && !initial) {

					transition.count--;	

					if(transition.count === 0) {

						objs['transition'][options.transition][direction](difference);
							
					}

					return;

				}

				for(var i = 0; i < images.length; i++) {

					var image = $(images[i]);

					if(!image.attr('zrs-src')) {

						transition.count--;						

						if(transition.count === 0) {

							objs['transition'][options.transition][direction](difference);
							
						}

						continue;

					};

					image.unbind('load').load(function(){

						transition.count--;
						image.removeAttr('zrs-src');

						if(transition.count == 0 && !initial) {

							objs['transition'][options.transition][direction](difference);
					           
						}					

					}).attr('src', image.attr('zrs-src'));

				}

			}

			transition.before = function(transition, direction, difference) {

				if(self.find('*').is(':animated')) return;

				transition = !transition ? options.transition : transition;
				direction = !direction ? options.direction : direction;

				difference = (!difference ? (direction == 'back' ? -Math.abs(options.slideBy) : options.slideBy) : (direction == 'back' ? -Math.abs(difference) : difference));

				if(options['transition'] === 'fade' && ins.animationFrameSupport === true) {

					cancelAnimationFrame(objs['transition'].animate);

				}

				objs['transition'].update(difference);
				objs['transition'].procedural(null, difference, direction)

				if(typeof options['pre_trans_callback'] === 'function') {

					options['pre_trans_callback']({

						current: elem['slides'].eq(direction == 'back' ? Math.abs(difference) : (ins.animationFrameSupport === true ? objs['slides'].count() -1 : 0)),
						next: elem['slides'].eq(difference)

					});				
					
				}

			}

			transition.after = function() {

				if(typeof options['trans_callback'] === 'function')	options['trans_callback']({

					current: elem['slides'].eq(0),
					currentNo: objs['slides'].currentSlide

				});

			}

			transition.target = function(difference) {

				if((objs['slides'].currentSlide + difference) > objs['slides'].count() -1) {

					return (objs['slides'].currentSlide + difference) - objs['slides'].count();

				} else if(objs['slides'].currentSlide + difference < 0) {

					return objs['slides'].count() + (objs['slides'].currentSlide + difference);

				} else {

					return objs['slides'].currentSlide + difference;
					
				}

			}

			transition.update = function(difference) {

				objs['slides'].currentSlide = transition.target(difference);

				objs['slides'].reIndex();

				options.pager ? objs['pager'].update() : null;				
				objs['controls'].play();

			}

			transition.goTo = function(target) {

				var difference = target - objs['slides'].currentSlide;
                
                objs['controls'].pause();

				if(target < objs['slides'].currentSlide) {

					objs['transition'].before(options.transition, 'back', difference);

				} else if(target > objs['slides'].currentSlide) {

					objs['transition'].before(options.transition, 'forward', difference);

				}

			}

			transition.fade = new function() {

				var method = this;

				method.setUp = function() {

					elem['slides'].eq(0).show();

					elem['slides'].css({

                        'top' : '0',
                        'left' : '0',
						'float' : 'left',
						'width' : '100%'

					});

					for(var i = 0; i < objs['slides'].count(); i++) {

						if(i === 0) {

							if(ins.animationFrameSupport === true) {

								if(options['fluidHeight'] === true) {

									elem['inner'].css({

										'min-height' : elem['slides'].eq(i).outerHeight(true) + 'px',
										'transition' : '0.25s'

									});
									
								}

								elem['slides'].eq(i).css({

									'position' : 'relative',
									'z-index' : '2',
									'opacity' : '1'

								});

							} else {

								elem['slides'].eq(i).css({

									'position' : 'relative',
									'z-index' : '1'

								});								

							}


						} else {

							if(ins.animationFrameSupport === true) {

								elem['slides'].eq(i).css({

									'position' : 'absolute',
									'z-index' : '0',
									'opacity' : '0'

								});

							} else {

								elem['slides'].eq(i).css({

									'position' : 'absolute',
									'z-index' : '0'

								}).hide();

							}

						}

					}

				}

				method.progress = function(difference, direction) {

					objs['transition'].animate = requestAnimationFrame(function() {

						if(transition.opacity === 0) {

							if(options['fluidHeight'] === true) {

								var newHeight = elem['slides'].eq(objs['slides'].currentSlide).outerHeight(true);

								if(elem['inner'].height() < newHeight) {

									elem['inner'].css({

										'min-height' : newHeight + 'px'

									});
									
								}								

							}

							elem['slides'].eq(objs['slides'].currentSlide).css({

								'z-index' : '2',
								'position' : (options['fluidHeight'] !== true ? 'relative' : 'absolute')

							});


							elem['slides'].not(elem['slides'].eq(objs['slides'].currentSlide)).css({

								'z-index' : '0',
								'position' : 'absolute'

							});

						}

						if(options['textFade'] === true) {

							transition.textOpacity-=((1 / (options['speed'] / 10)) * 1.5);

							elem['slides'].eq(objs['slides'].currentSlide - difference).css({

								'opacity': transition.textOpacity

							});
								
						}

						transition.opacity+=(1 / (options['speed'] / 10));

						elem['slides'].eq(objs['slides'].currentSlide).css({

							'opacity' : transition.opacity

						});

						if(Math.min(transition.opacity, 1) === 1) {

							var newHeight = elem['slides'].eq(objs['slides'].currentSlide).outerHeight(true);

							transition.opacity = 0;
							transition.textOpacity = 1;

							if(elem['inner'].height() > newHeight && options['fluidHeight'] === true) {

								elem['inner'].css({

									'min-height' : newHeight + 'px'

								});
								
							}

							elem['slides'].not(elem['slides'].eq(objs['slides'].currentSlide)).css({

								'opacity': transition.opacity

							});

							cancelAnimationFrame(objs['transition'].animate);
							objs['transition'].after();

							return;

						}

						method[direction](difference, direction);

					});

				}

				method.forward = function(difference) {

					if(ins.animationFrameSupport === true) {

						method.progress(difference, 'forward');

					} else {

						elem['slides'].eq(difference).css({

							'z-index' : '2'

						}).fadeIn(options.speed, function() {
						
							elem['slides'].eq(difference).css({

								'position' : 'relative'

							});
							
							for(var i = 0; i < difference; i++) {

								elem['slides'].eq(0).css({

									'z-index' : '1',
									'position' : 'absolute'

								}).appendTo(elem['inner']).hide();
								
								objs['slides'].reIndex();

							}

							objs['transition'].after();

						});						

					}

				}

				method.back = function(difference) {
				
					if(ins.animationFrameSupport === true) {

						method.progress(difference, 'back');

					} else {

						for(var i = 0; i > difference; i--) {

							elem['slides'].eq(objs['slides'].count() - 1).prependTo(elem['inner']);
							objs['slides'].reIndex();

						}

						elem['slides'].css({

							'z-index' : '0'

						});

						elem['slides'].eq(0).css({

							'z-index' : '1',
							'position' : 'absolute'

						}).fadeIn(options.speed, function(){

							elem['slides'].eq(0).css({

								'position' : 'relative'

							});

							elem['slides'].not(':first-child').css({

								'z-index' : '0',
								'position' : 'absolute'

							}).hide();

							objs['transition'].after();

						});						

					}

				}

			}

		}

		ins.controls = function() {

			var method = this;

			method.play = function() {

				method.pause();
				
				if(options['delay'] === 0) return;
				ins.timer = setTimeout(objs['transition'].before, options.delay, options.transition);

			}

			method.pause = function() {

				clearTimeout(ins.timer);

			}

		}

		ins.pager = function() {

			var method = this,
				pagers;

			method.setUp = function() {

				if(!method.checks()) return;

				method.populate();

				elem['pager'] = options.pager;
				pagers = elem['pager'].children();

				method.update();
				method.bindings();

			}

			method.checks = function() {

				if(!options.pager) return false;

				if(typeof options.pager != 'object') {

					objs['misc'].report('warn', 'Please pass an jQuery selector as the pager option!');
					return false;

				}

				if(options.pager.size() <= 0) {

					objs['misc'].report('error', 'Cannot find pager container, please double check your selector!');
					return false;

				}

				return true;

			}

			method.populate = function() {

				for(var i = 0; i < objs['slides'].count(); i++) {

					$('<a />', {

						'href' : 'javascript:void(0);',
						'data-target' : i

					}).appendTo(options.pager);

				}

			}

			method.update = function() {

				pagers.removeClass('active');
				pagers.eq(objs['slides'].currentSlide).addClass('active');

			}

			method.bindings = function() {

				pagers.on('click', objs['pager'].goTo);

			}

			method.goTo = function() {

				objs['transition'].goTo($(this).data('target'));

			}

		}

		ins.init = function() {

			setUp.init();

		}

	}

})();