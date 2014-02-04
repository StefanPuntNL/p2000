$(document).ready(function() {
	    var startUrl = ' http://www.alarmeringen.nl/feeds/all.rss';
		var url = 'http://www.alarmeringen.nl/feeds/';
			

        // Accepts a url and a callback function to run.
		function requestCrossDomain(site, callback) {
 
		    // If no url was passed, exit.
		    if (!site) {
		        alert('No site was passed.');
		        return false;
		    }
 
		    // Take the provided url, and add it to a YQL query. Make sure you encode it!
		    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
 
		    // Request that YSQL string, and run a callback function.
		    // Pass a defined function to prevent cache-busting.
		    $.getJSON(yql, cbFunc);
 
		    function cbFunc(data) {
		        // If we have something to work with...
		        if (data.results[0]) {
		            if (typeof callback === 'function') {
		                callback(data);
		            }
		        }
		        // Else, Maybe we requested a site that doesn't exist, and nothing returned.
		        else throw new Error('Nothing returned from getJSON.');
		    }
		}


		function readFeed(limit, url) {
    		requestCrossDomain(url, function (result) {
        		var num = 1;

        		var browserName = navigator.appName;
        		var doc;
        
        		if (browserName == 'Microsoft Internet Explorer') {
            		doc = new ActiveXObject('Microsoft.XMLDOM');
            		doc.async = 'false'
            		doc.loadXML(result.results);
        		} else {
            		doc = (new DOMParser()).parseFromString(result.results, 'text/xml');
        		}
        	
        		var xml = doc;
 
        		$(xml).find('item').each(function () {

            		if (num <= limit) {
            			var type = '';
            			var classType = '';

                		var date = new Date($(this).find('pubDate').text());
                		
                		var y = date.getFullYear();
                		var m = ( '0' + (date.getMonth()+1) ).slice( -2 );
                		var d = ( '0' + date.getDate()).slice( -2 );
                		var h = ( '0' + date.getHours()).slice( -2 );
                		var min = ( '0' + date.getMinutes()).slice( -2 );

                		var title = $(this).find('title').text();
                		var description = $(this).find('description').text();

                		if(description.toLowerCase().indexOf('brandweer') >= 0) {
                			type = 'brandweer';
                			
                		} else if(description.toLowerCase().indexOf('ambulance') >= 0) {
                			type = 'ambulance';
                			
                		} else if(description.toLowerCase().indexOf('knrm') >= 0) {
                			type = 'knrm';
                			
                		} else if(description.toLowerCase().indexOf('politie') >= 0) {
                			type = 'politie';
                		}
                		
                		$('tbody').append('<tr class="alarm-item"><td><img src="img/'+type+'.png" alt="'+type+'"/></td><td>'+d+'-'+m+'-'+y+'</td><td>'+h+':'+min+'</td><td>'+title+'</td><td>'+description+'</td></tr>');

                		num++;
            		}
        		});
    		});
		}

		readFeed(15, startUrl);

        $('#filter').click(function(e) {
            e.preventDefault();
            
            if($('#regio').val() == 'all' && $('#discipline').val() == 'all') {
                readFeed(15, startUrl);
            } else if($('#regio').val() == 'all' && $('#discipline').val() !== 'all') {
                var discipline = $('#discipline').val();
                url += 'discipline/'+ discipline + '.rss';
                readFeed(15, url);
            }
        });

});