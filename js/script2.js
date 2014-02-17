function alarm(title, description, date) {
	var that = this;

	this.title = title;
	this.description = description;
	this.date = new Date(date);
	this.type = '';
	this.prioClass = 'no-prio';
	this.checkType = (function() {
		if(that.description.toLowerCase().indexOf('brandweer') >= 0) {
            that.type = 'brandweer';
        } else if(that.description.toLowerCase().indexOf('ambulance') >= 0) {
			that.type = 'ambulance';
		} else if(that.description.toLowerCase().indexOf('knrm') >= 0) {
			that.type = 'knrm';
		} else if(that.description.toLowerCase().indexOf('politie') >= 0) {
			that.type = 'politie';
		}
	})();
	this.prio = (function() {
		if(that.title.toLowerCase().indexOf('p1') >= 0 || that.title.toLowerCase().indexOf('prio 1') >= 0 || that.title.toLowerCase().indexOf('a1') >= 0) {
			that.prioClass = 'text-danger';
		}	
	})();
}

var p2000 = {
	startUrl: 'http://www.alarmeringen.nl/feeds/all.rss',
	baseUrl: 'http://www.alarmeringen.nl/feeds/',
	discipline: 'all',
	region: 'all',
	
	xmlRequest: function() {
		var that = this;

		var url = '';

		//empty the alarms array
		that.alarms.length = 0;

		if (that.region === 'all' && that.discipline === 'all') {
			url = that.startUrl;
		} else if (that.region !== 'all' && that.discipline === 'all') {
			url = that.baseUrl+'region/'+that.region+'.rss';
		} else if (that.region === 'all' && that.discipline !== 'all') {
			url = that.baseUrl+'discipline/'+that.discipline+'.rss';
		} else {
			url = that.baseUrl+'region/'+that.region+'/'+that.discipline+'.rss';
		}

		//set variables for the request
		var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';
		var doc;

		//get the request, push the data in an array with objects
		$.getJSON(yql, function(data) {
			return (
				doc = (new DOMParser()).parseFromString(data.results, 'text/xml'),
				$(doc).find('item').each(function() {
					that.alarms.push(new alarm($(this).find('title').text(), $(this).find('description').text(), $(this).find('pubDate').text()));
				})
			)
		});
	},

	alarms: [],

	showData: function() {
		var that = this;
		var i = 0;

		$('.list-group-item').each(function() {
			$(this).hide();
		})

		for(i = 0; i < 2; i++) {
			var date = that.alarms[i].date

			var y = date.getFullYear();
            var m = ( '0' + (date.getMonth()+1) ).slice( -2 );
            var d = ( '0' + date.getDate()).slice( -2 );
            var h = ( '0' + date.getHours()).slice( -2 );
            var min = ( '0' + date.getMinutes()).slice( -2 );
			
			$('.list-group').append('<li class="list-group-item '+that.alarms[i].prioClass+'">'+'<h4 class="list-group-item-heading">'+that.alarms[i].description+'</h4>'+that.alarms[i].title+'<span class="badge">'+d+'-'+m+'-'+y+' '+h+':'+min+'</span></li>');
			
			
		}
	}

}

p2000.xmlRequest();

$(window).load(function() {
	p2000.showData();

	$('#discipline').change(function () {
		p2000.discipline = $(this).val();
		p2000.xmlRequest();
	});

	$('#regio').change(function () {
		p2000.region = $(this).val();
		p2000.xmlRequest();
	});

	$('#filter').click(function() {
		p2000.showData();
	});
});





