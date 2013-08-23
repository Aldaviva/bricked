(function(){
	
	var Service = Backbone.Model.extend({});
	var ServiceCollection = Backbone.Collection.extend({
		model: Service,
		url: '/services'
	});

	var ServiceListView = Backbone.View.extend({
		className: "ServiceList",

		initialize: function(){
			_.bindAll(this);

			this.collection.on('add', this.addService);
		},

		render: function(){
			return this.el;
		},

		addService: function(service){
			var view = new ServiceRow({ model: service });
			this.$el.append(view.render());
		}
	});

	var ServiceRow = Backbone.View.extend({
		className: 'service',

		initialize: function(){
			_.bindAll(this);

			this.model.on('change:isWorking', this.render);
		},

		render: function(){
			if(this.$el.is(':empty')){
				this.$el.append(
					$('<span>', { class: 'indicator' }),
					$('<span>', { class: 'name', text: this.model.id })
				);
			}

			this.$el.toggleClass('working', !!this.model.get('isWorking'));

			return this.el;
		}
	});
	
	var serviceCollection = new ServiceCollection();
	var serviceListView = new ServiceListView({ collection: serviceCollection });

	$(document.body).prepend(serviceListView.render());

	serviceCollection.fetch();
	//TODO replace with eventing
	setInterval(function(){
		serviceCollection.fetch();
	}, 5*1000);

})();