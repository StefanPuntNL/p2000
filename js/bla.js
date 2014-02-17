$('tbody').append('<tr class="alarm-item"><td><img src="img/'+type+'.png" alt="'+type+'"/></td><td>'+d+'-'+m+'-'+y+'</td><td>'+h+':'+min+'</td><td><span class="animate glyphicon glyphicon-asterisk"></span>'+title+'</td><td>'+description+'</td></tr>');


$('#filter').click(function(e) {
            e.preventDefault();

            switch(true) {
                case (regio == 'all' && discipline == 'all'):
                readFeed(15, startUrl);
                break;

                case (regio !== 'all' && discipline == 'all'):
                readFeed(15, baseUrl+'region/'+regio+'.rss');
                break;

                case (regio == 'all' && discipline !== 'all'):
                readFeed(15, baseUrl+'discipline/'+discipline+'.rss');
                break;

                case (regio !== 'all' && discipline !== 'all'):
                readFeed(15, baseUrl+'region/'+regio+'/'+discipline+'.rss');
                break;
            }
        });

        $('#refresh').click(function(e) {
            e.preventDefault();
            
            switch(true) {
                case (regio == 'all' && discipline == 'all'):
                readFeed(15, startUrl);
                break;

                case (regio !== 'all' && discipline == 'all'):
                readFeed(15, baseUrl+'region/'+regio+'.rss');
                break;

                case (regio == 'all' && discipline !== 'all'):
                readFeed(15, baseUrl+'discipline/'+discipline+'.rss');
                break;

                case (regio !== 'all' && discipline !== 'all'):
                readFeed(15, baseUrl+'region/'+regio+'/'+discipline+'.rss');
                break;
            }
        });