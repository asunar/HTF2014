var SessionsView = function(sessionsToDisplay, adapter) {

    this.initialize = function() {
        this.el = document.createElement("div");
    };

    this.render = function() {
	var template = " \
			{{#.}} \
				<div style='margin-top:10px;border-bottom: 5px solid #DCDCDC;'>{{ Day }}</div>  \
					<ul class='table-view'> \
				{{#Sessions}} \
					{{#.}} \
					<li class='table-view-cell'> \
						<a class='navigate-right' href='#sessiondetails?id={{ Id }}' > \
						<span class='media-object pull-left '>{{ this.Time }}</span> \
						{{ this.Title }} \
						</a> \
						<a class='btn'><i data-id={{ Id }} class='fa fa-{{#if this.IsInMySchedule }}minus{{else}}plus{{/if}}'></i></a> \
				</li> \
					{{/ .}} \
				{{/ Sessions}} \
				</ul> \
			{{/ .}} \
			  ";

			var sessionsTemplate = Handlebars.compile(template);
      this.el.innerHTML = sessionsTemplate(sessionsToDisplay);
			this.wireUpEvents(adapter);
      return this.el;
    };


		this.wireUpEvents = function(adapter) {
			var buttonNodes = this.el.getElementsByClassName('btn');
			// convert nodelist into an array
			var addButtons = Array.prototype.slice.call(buttonNodes, 0);
			addButtons.forEach(function(button){
				button.onclick = function(e){
					var icon = this.getElementsByTagName('i')[0];
					var id = parseInt(icon.dataset.id, 10);
					var isAdding = icon.classList.contains("fa-plus");
					if(isAdding){
						adapter.addToMySchedule(id);
						icon.classList.remove("fa-plus");	
						icon.classList.add("fa-minus");	
					} else {
						adapter.removeFromMySchedule(id);
						icon.classList.remove("fa-minus");	
						icon.classList.add("fa-plus");	
					}
				}
			});
		};

    this.initialize();
}
