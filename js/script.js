var startUrl = ' http://www.alarmeringen.nl/feeds/all.rss';
var baseUrl = 'http://www.alarmeringen.nl/feeds/';
var regio = 'all';
var discipline = 'all';
var num = 1;
var xml;

function requestCrossDomain(site, callback) {
    

    if (!site) {
        alert('No site was passed.');
        return false;
    }

    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';

    $.getJSON(yql, cbFunc);

    function cbFunc(data) {

        if (data.results[0]) {
            if (typeof callback === 'function') {
                callback(data);
            }
        }

        else throw new Error('Nothing returned from getJSON.');
    }
}

function readFeed(url) {


    requestCrossDomain(url, function (result) {

        var browserName = navigator.appName;
        var doc;

        if (browserName == 'Microsoft Internet Explorer') {
            doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.async = 'false'
            doc.loadXML(result.results);
        } else {
            doc = (new DOMParser()).parseFromString(result.results, 'text/xml');
        }
    
        xml = doc;

        
    });
}

readFeed(startUrl);

$(window).load(function() {
    
    function showItems() {

        $(xml).find('item').each(function () {


            if (num <= 1) {
                var type = '';

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
                console.log(title);
                num++;
            }
        });
    }

    $('#discipline').change(function () {
        var url = baseUrl+'discipline/'+$(this).val()+'.rss';
        readFeed(url);
        console.log(url);
        showItems();
        
    });

    $('#filter').click(function() {
        readFeed(startUrl);
        showItems();
        num = 1;
    });

    $('#refresh').click(function() {
        readFeed(startUrl);
        showItems();
        num = 1;
    });
	        
});







