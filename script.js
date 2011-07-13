$(document).ready(function(){
  $("#query").focus()
  var url='http://domai.nr/api/json/search?q=';       // URL for gathering json SEARCH data.
  var query;
  $('form').submit(function(){                        // onSubmit...
    if ($('#query').val() != ""){                     // if the value is not blank...
      $('body').width(250);                           // reset the body width to the default width
      $("#loader").css('visibility', 'visible');      // show the spinny thingy.
      $("#results-list li").remove();                 // remove the previous results
      $("#search-query").remove();                    // remove the previous black
      $(".extension a").remove();
      $("#results-info").hide();                      // hide the larger panel, and wait until user clicks on an option to show it again.
      query = $("#query").val();                      // setting the var to what the user submitted.
      new XMLHttpRequest();                           // cuz i'm cool and have to do this.
      $.getJSON(url+query, null, function(json){      // grab the JSON from the url + what the user searched (concatenated).
        $('<p id="search-query">' + json.query + '</p>').insertBefore('#results');    // show what the user searched for
        $.each(json.results,function(i, result){      // for each result, do this, man!
          if (result.availability === "available")    // if the domain is available, do cool stuff
            $('#results-list').append('<li class="available"><a href="#"><span class="bg">&nbsp;</span><span class="domain">' + result.domain + '</span><span class="path">' + result.path + '</span></a><img class="loader-sub" src="images/loading-blue.gif" style="visibility:hidden;" /></li>');
          else if (result.availability === "maybe")   // if the domain is maybe available, do mediocre stuff
            $('#results-list').append('<li class="maybe"><a href="#"><span class="bg">&nbsp;</span><span class="domain">' + result.domain + '</span><span class="path">' + result.path + '</span>' + '</a><img class="loader-sub" src="images/loading-blue.gif" style="visibility:hidden;" /></li>');
          else                                        // otherwise, it's not available. that sucks.
            $('#results-list').append('<li class="nothing"><a href="#"><span class="bg">&nbsp;</span><span class="domain">' + result.domain + '</span><span class="path">' + result.path + '</span>' + '</a><img class="loader-sub" src="images/loading-blue.gif" style="visibility:hidden;" /></li>');
        }); // end $.each
        $("#loader").css('visibility', 'hidden');     // hide the spinny thingy.
        
      }); // end $.getJSON
      $(this).find('#query').focus();                 // auto-focus the input for part deux!
      return false; // don't refresh the page on form submit.
    } else {
      $(".extension a").first().remove();  
      $(".registrars ul li").remove();
      $('body').width(250);                           // ...and we're back home now.
    }
  }); // end of submit()    
  
  var infoURL = 'http://domai.nr/api/json/info?q='; // setting the var to the INFO request.
  
  
  $("#results-list a").live('click', function(){  // this is required, cuz the elements populate the DOM after the user searches for something; not onLoad.

        
    $(this).siblings('.loader-sub').css('visibility', 'visible');
    $(".extension a").first().remove();           // remove the previous extension (link next to 'TLD').
    $(".registrars ul li").remove();
    $.getJSON(infoURL + $(this).find('.domain').text(), null, function(json){ // ...do some JSON magic again.
      console.log(json);
      $("#wikipedia").attr('href', (json.tld['wikipedia_url']));
      $("#iana").attr('href', (json.tld['iana_url']));
      $(".whois a").attr('href', (json.whois_url));
      $(".www a").attr('href', 'http://' + (json.domain));
      $(".extension").append('<a href="http://www.domai.nr/' + (json.domain.split('.')[1]) + '" target="_blank">' + (json.domain.split('.')[1]) + '</a>').show();
      
      
      $('.loader-sub').css('visibility', 'hidden');
     
      
     if (json.registrars.length < 1){
       $(".registrars ul").append('<li>(not available)</li>');
       $("#availability h3").text('Not Available. :(');
     } 
     
     else {
        for (var i = 0; i <= 5; i++){
            $(".registrars ul").append('<li><a href="' + json.registrars[i].register_url + '" target="_blank">' + json.registrars[i].name + '</a></li>');
        } 
        $(".registrars ul").append("<li><a href='#' id='load-more'>More...</a></li>");
     }
             
      $("#load-more").click(function(){
        $(this).remove();
        for (var i = 6; i <= json.registrars.length - 1; i++){
          $(".registrars ul").append('<li><a href="' + json.registrars[i].register_url + '" target="_blank">' + json.registrars[i].name + '</a></li>');
        } 
      });
      return false;
    });
    
    
    $('body').width(800);                         // make it bigger.
    $('#results-list a').removeClass('active');   // remove the siblings' possibility of being .active
    $(this).addClass('active');                   // give 'r .active
    $("#results-info").show();                    // show the cool results stuff
    if ($(this).parent().hasClass('available')){  // ...and some conditionals, based on availability
      $("#availability").html("<h3 class='available'>Available!</h3>");
    } else if ($(this).parent().hasClass('maybe')){
      $("#availability").html("<h3 class='possibly'>Possibly Available</h3>");
    } else {
      $("#availability").html("<h3 class='taken'>This domain is <span>taken</span>.</h3>");
    }
    
    // populate the Register at link
    
    $("#results-info").show();
    return false;  // don't link to anything in the dropdown list
  });
  
  
});