(function(window){

	var BrewApp = function() {

		var _appInstance;
		
		function addListener() {
			$(window).resize(function() {
				var width = $(window).width();
				var status = "desktop";
				if(width <= 1024) status = "tablet";
				if(width < 768) status = "mobile";

				if(_appInstance.screenStatus != status) {
                    //triggered once on status change

				}else {
                    _appInstance.screenStatus = status;
                    //triggered on resize

				}
			});
		}
		
		this.init = function() {
			_appInstance = this;

			_.templateSettings.interpolate = /{([\s\S]+?)}/g;
			_.templateSettings.escape = /{{([\s\S]+?)}}/g;

			this.screenStatus = "desktop";

			addListener();
			setTimeout(function() {
				$(window).trigger('resize');
			}, 350);
		};

		this.router = {
			navigate(url) {
				window.document.location.href = url;
			}
		}

		this.http = {
			get(url, queryParams, dataType="json") {
				return this.ajax({ url: url, method: "GET", dataType: dataType });
			},
			post(url, data) {
				return this.ajax({ type: "POST", url: url, data: data });
			},
			ajax(settings) {
				return new Promise(function(resolve, reject) {
					_appInstance.loading.show();
					$.ajax( settings )
					.done(function(data, textStatus, jqXHR) {
						resolve(data);
					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						reject(Error(textStatus));
					})
					.always(function() {
						_appInstance.loading.hide();
					});
				});
			}
        }
        
        this.overlay = {
			isOpen: false,
			open() {
				this.isOpen = true;
				$("html").addClass("no-scroll");
				$("body").addClass("has-overlay");
			},
			close() {
				this.isOpen = false;
				$("html").removeClass("no-scroll");
				$("body").removeClass("has-overlay");
			},
			toggle(){
				this.isOpen ? this.close() : this.open();
			} 
		}

		this.loading = {
			component: null,
			selector: "c-loading-box",
			template: `
				<div class="sk-fading-circle">
					<div class="sk-circle1 sk-circle"></div>
					<div class="sk-circle2 sk-circle"></div>
					<div class="sk-circle3 sk-circle"></div>
					<div class="sk-circle4 sk-circle"></div>
					<div class="sk-circle5 sk-circle"></div>
					<div class="sk-circle6 sk-circle"></div>
					<div class="sk-circle7 sk-circle"></div>
					<div class="sk-circle8 sk-circle"></div>
					<div class="sk-circle9 sk-circle"></div>
					<div class="sk-circle10 sk-circle"></div>
					<div class="sk-circle11 sk-circle"></div>
					<div class="sk-circle12 sk-circle"></div>
				</div>
			`,
			show() {
				_appInstance.overlay.open();
				if(!this.component) this.create();
				this.component.addClass(this.selector + "--show");
				$(document).click(this.clickHandler);
			},
			hide(removeComponent = true) {
				_appInstance.overlay.close();
				this.component.addClass(this.selector + "--hide");
				if(removeComponent) this.destroy();
				$(document).off('click', this.clickHandler);
			},
			clickHandler(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			create() {
				if(!this.component) {
					this.component = $('<div>', {
						class: this.selector
					});
					$('body').append(this.component);
					this.component.html(this.getTemplate(null));
				}
			},
			destroy() {
				if(this.component) this.component.remove();
			},
			getTemplate(data) {
				var self = this;
				return _.template(self.template)({data: data, dictionary: self.dictionary})
			}
		}
	};

	BrewApp.ready = function(onReady, createNewInstance = false) {
		if(onReady instanceof Function) {
			onReady(BrewApp.createApp());
		}
	};

	BrewApp.createApp = function(forceToNewInstance, createNewInstance) {
		var app;
		if(forceToNewInstance) {
			app = new BrewApp();
			app.init();
		}else {
			if(!BrewApp.instance) {
				app = new BrewApp();
				app.init();
				BrewApp.instance = app;
			}
		}
		return app;
	};

	window.BrewApp = BrewApp;

})(window);

$(document).ready(function() {
	window.BrewApp.ready(function(app) {
        console.log("Brewww Interactive");
        console.log("==================");
        console.log("Gulp Template 1.1.0 Ready");

		window.GulpTemplateApp = app;
        //add page listeners here

        // show fake loading
		app.loading.show();

		// hide fake loading
		setTimeout(function(){
			window.GulpTemplateApp.loading.hide();
		}, 2000);
		
	});
});