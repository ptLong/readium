

Readium.Views.FixedPaginationView = Readium.Views.PaginationViewBase.extend({

	initialize: function() {
		// call the super ctor
		this.page_template = _.template( $('#fixed-page-template').html() );
		this.empty_template = _.template( $('#empty-fixed-page-template').html() );
		Readium.Views.PaginationViewBase.prototype.initialize.call(this);
		//this.model.on("first_render_ready", this.render, this);
		this.model.on("change:two_up", this.setUpMode, this);
	},

	// sometimes these views hang around in memory before
	// the GC's get them. we need to remove all of the handlers
	// that were registered on the model
	destruct: function() {
		console.log("Fixed paginator destructor called");

		// call the super constructor
		Readium.Views.PaginationViewBase.prototype.destruct.call(this);

		// remove any listeners registered on the model
		this.model.off("change:two_up", this.setUpMode);
	},

	render: function() {

		$('body').addClass('apple-fixed-layout');

		// appends one fixed layout page to those currently rendered
		//var metaTags = this.model.parseMetaTags();
		//this.$el.width(metaTags.meta_width * 2);
		//this.$el.height(metaTags.meta_height);

		// wipe the html
		this.$('#container').html("");

		// add the current section
		//this.addPage( this.model.getCurrentSection(), 1 );
		//currentPage = this.model.set("current_page", [1]);
		setTimeout(function() {
			$('#page-wrap').zoomAndScale(); //<= this was a little buggy last I checked but it is a super cool feature
		}, 1)
		return this.renderPages();
	},

	addPage: function(sec, pageNum) {
		var that = this;
		var content = sec.getPageView().render().el;
		$(content).attr("id", "page-" + pageNum.toString());
		$('.content-sandbox', content).on("load", function(e) {
			that.iframeLoadCallback(e);
		});
		this.$('#container').append(content);
		this.changePage();
		return this;
	},

	renderPages: function() {
		// lost myself in the complexity here but this seems right
		this.changePage();
		return this;
	},

	changePage: function() {
		var that = this;
		var currentPage = this.model.get("current_page");
		var two_up = this.model.get("two_up")
		this.$(".fixed-page-wrap").each(function(index) {
			$(this).toggle(that.isPageVisible(index + 1, currentPage));
		});
	},

});


Readium.Views.FixedPageView = Backbone.View.extend({

	className: "fixed-page-wrap",

	initialize: function() {
		this.template = _.template( $('#fixed-page-template').html() );
		this.model.on("change", this.render, this);
	},

	destruct: function() {
		this.model.off("change", this.render);
	},

	render: function() {
		var that = this;
		var json = this.model.toJSON();
		this.$el.html( this.template( json ) );
		this.$el.addClass( this.model.getPositionClass() );
		this.$('.content-sandbox').on("load", function() {
			that.trigger("iframe_loaded");
		});
		return this;
	},

	iframe: function() {
		return this.$('.content-sandbox')[0];
	}

});
