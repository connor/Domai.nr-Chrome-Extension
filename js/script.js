var t;

$(document).ready( function() {

  var createChromeTab = function(url) {
    return chrome.tabs.create({
      url: url
    })
  }

  var API_URL = "https://domai.nr/api/json/search?client_id=chrome_extension&q="
    , selected_domain

  $("#search-form").submit( function(evt) {
    evt.preventDefault()

    $("#loader").css('visibility', 'visible');
    var query = $("#query").val()

    if (!query.length) {
      $("#search-query").remove();
      $.each($("#results-list li"), function(idx, el) {
        $(el).remove();
      });
      $("#loader").css('visibility', 'hidden');     // hide the spinny thingy.
    } else {
      $.getJSON(API_URL + query, null, function(response) {
        $("#results-list").empty()
        if ($("#search-query").length) {
          $("#search-query").text(query)
        } else {
          $("<p id='search-query'>" + query + "</p>").insertBefore("#results")
        }
        $.each(response.results,function(i, result){
          $("#results-list").append("<li class='" + result.availability + "'><a href='https://domai.nr/" + query + "'><span class='bg'></span><span class='domain'>" + result.domain + "</span></a></li>")
        })
        $("#loader").css('visibility', 'hidden');     // hide the spinny thingy.
      });
    }
  })

  function moveSelectionUp() {
    if ( $(".selected").length ) {
      if ( $(".selected").prev().length ) {
        $("#results-list li.selected").removeClass('selected')
                                      .prev()
                                      .addClass('selected')
      } else {
        $("#results-list li.selected").removeClass('selected')
        $("#results-list li").last().addClass('selected')
      }
    } else {
      $("#results-list li").last().addClass('selected')
    }
  };

  function moveSelectionDown() {
    if ( $(".selected").length ) {
      if ( $(".selected").next().length ) {
        $("#results-list li.selected").removeClass('selected')
                                      .next()
                                      .addClass('selected')
      } else {
        $("#results-list li.selected").removeClass('selected')
        $("#results-list li").first().addClass('selected')
      }
    } else {
      $("#results-list li").first().addClass('selected')
    }
  };

  $("#query").keydown( function(evt) {
    var keyCode = evt.keyCode;

    if (keyCode === 38 || keyCode === 40) {
      if (keyCode === 38) {
        moveSelectionUp();
      } else {
        moveSelectionDown();
      }
    }

    else if (keyCode === 13) {
      var val = $(this).val();
      var $selected = $(".selected");
      if ($selected.length) {
        var url = $(".selected a").attr('href') + "/with/" + $(".selected a").text();
        createChromeTab(url);
      }
      return false;
    }

    else {
      window.clearTimeout(t)
      t = window.setTimeout( function() {
        $("#search-form").submit()
      }, 200);
    }
  });

  $("#results-list li a").live('click', function(ev) {
    var url = $(this).attr('href') + "/with/" + $(this).text()
    createChromeTab(url)
  });

})
