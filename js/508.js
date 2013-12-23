	(function($) {
		$(document).ready(function() {
			var $tr = $('<tr>'),
				  $ul = $('<ul>');
			$.getJSON('/dist/tests.json', function(tests) {
				var testAlignment = {};
				$.each(tests, function(testName, test) {
					if(typeof test.guidelines['508'] !== 'undefined') {
						$.each(test.guidelines['508'], function(index, letter) {
							if(typeof testAlignment[letter] === 'undefined') {
								testAlignment[letter] = {};
							}
							testAlignment[letter][testName] = test;
						});
					}
				});
				$.getJSON('/dist/guidelines/508.json', function(guideline) {
					$.each(guideline.guidelines, function(id, sc) {
						$tr = $('<tr>');
						$tr.append('<td><strong>' + id + '</strong></td><td>' + sc.title + '</td>');
						$ul = $('<ul>');
						if(typeof testAlignment[id] !== 'undefined') {
							$.each(testAlignment[id], function(testName, test) {
								$ul.append('<li><a href="/tests/view#' + testName +'.html">' + testName + '</a></li>');
							});
							$tr.append('<td>' + $ul.html() + '</td>');
						}
						else {
							$tr.append('<td><strong>No tests</strong></td>');
						}
						$('#guideline tbody').append($tr);
					});
					$('#loading').remove();
				});
			});
		});
	})(jQuery);
