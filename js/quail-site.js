(function($) {
  $(document).ready(function() {
    var messages = { imgHasAlt : 'Your images are missing alt text here. Better fix that.',
                     documentAbbrIsUsed : 'This abbreviation needs to be wrapped in an abbr or acronym tag.'
    };
    if(typeof $.fn.sticky !== 'undefined') {
      $(".sticky").sticky({topSpacing: 15});
    }
    $('.demonstration').quail({jsonPath : '/dist', 
                               guideline : [ 'imgHasAlt', 'documentAbbrIsUsed' ],
                               testFailed : function(event) {
          	                    if(event.testName == 'documentAbbrIsUsed') {
            	                    event.element.html(event.element.html().replace(event.options.acronym, '<span class="quail-result moderate" title="' + messages[event.testName] +'">' + event.options.acronym + '</span>'));
          	                    }
          	                    else {
            	                    event.element.addClass('quail-result')
          	                           .addClass(event.severity)
          	                           .attr('title', messages[event.testName]);
          	                    }
          	                    $('.quail-result').tooltip();
        	                    }});
    });
    if($('#tests').length) {
      var severity = {
        0     : '<span class="label label-success">Suggestion</span>',
        0.5   : '<span class="label label-primary">Moderate</span>',
        1     : '<span class="label label-danger">Severe</span>'
      };
      $.getJSON('/dist/tests.min.json', function(data) {
        $.each(data, function(index, test) {
          var title = (typeof test.title !== 'undefined') ? test.title.en : 'No title';
          var guidelines = [];
          $.each(test.guidelines, function(name, guideline) {
            guidelines.push(name);
          });
          $('#tests tbody').append('<tr><td><a href="/tests/view#' + index + '">' + title +'</a></td><td>' + index + '</td><td>' + test.tags.join(', ') + '</td><td>' + severity[test.testability] +'</td><td>' + guidelines.join(', ') + '</td></tr>');
        });
      });
    }
})(jQuery);
