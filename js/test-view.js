(function($) {
	$(document).ready(function() {
		var testName = window.location.hash.replace('#', '').trim();
		if(!testName) {
			return;
		}
		$.getJSON('/tests/reviewed.json', function(reviewed) {
			$.getJSON('/dist/tests.min.json', function(tests) {
				var test = tests[testName];
				if(typeof test === 'undefined') {

					return;
				}
				test.raw = JSON.stringify(test, null, 2);
				test.testName = testName;
				var guidelines = test.guidelines;
				test.guidelines = { wcag : [], 508: []};
				if(typeof guidelines.wcag !== 'undefined') {
					$.each(guidelines.wcag, function(sc, data) {
						$.each(data.techniques, function(index, technique) {

							test.guidelines.wcag.push({id : sc, technique : technique, hash : sc.replace(/\./g, '-') + '-' + technique });
						});
					})
				}
				test.reviewed = (reviewed.indexOf(testName) !== -1);
				var template = Handlebars.compile($('#test-template').html());
				$('#test').html(template(test)).find('form').on('submit', function(e) {
					e.preventDefault();
					var data = {
			      'description': '#quailtest Quail description for ' + testName,
			      'public': true,
			      'files': {
			        'description.html': {
			          'content': $('#help').val()
			        }
			      }
			    }
			    $.ajax({
			      url: 'https://api.github.com/gists',
			      type: 'POST',
			      dataType: 'json',
			      data: JSON.stringify(data)
			    })
			    .success(function(result) {
			    	$('#test form').prepend('<div class="alert alert-success">Thanks, we\'ll take a look!</div>');

			    })
			    .error(function(err) {
			    	$('#test form').prepend('<div class="alert alert-danger">Whoops, looks like gist is down. Try later!</div>');
			    })
				});

			});
		});
	});
})(jQuery);
