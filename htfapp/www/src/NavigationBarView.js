var NavigationBarView = function(adapter) {

    this.initialize = function() {
        this.el = document.createElement("div");
    };

    this.render = function() {

				var template = 
			"<nav class='bar bar-tab' style='height:10%'>"
		+		'<a class="tab-item active" href="#">'
		+     "<i class='fa fa-home fa-w fa-2x'></i>"
		+		"</a>"	
		+		"{{# . }}"	
		+   '<a class="tab-item" href="{{ url }}">'
		+			"<i class='{{ icon }} fa-w fa-2x'></i>"
		+		"</a>"
		+		"{{/.}}"	
		+	'</nav>';

			 menuTemplate = Handlebars.compile(template)	
       this.el.innerHTML = menuTemplate(adapter.getNavigationBarItems());
			 this.wireUpEvents();
       return this.el;
    };

		this.wireUpEvents = function() {
			var navBarCells = this.el.getElementsByTagName('a');

			// convert nodelist into an array
			var cells = Array.prototype.slice.call(navBarCells, 0);
			cells.forEach(function(cell){
				cell.onclick = function(e){
					cells.forEach(function(c){ c.classList.remove('active');  })
					cell.classList.toggle('active');
				}
			});
		};

    this.initialize();
};
