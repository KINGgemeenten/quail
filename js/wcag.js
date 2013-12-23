	(function($) {
		$(document).ready(function() {
			var $tr = $('<tr>');
			var firstRow = true;
			$.getJSON('/dist/tests.json', function(tests) {
				var testAlignment = {sc : {}, technique : {}};
				$.each(tests, function(testName, test) {
					if(typeof test.guidelines.wcag !== 'undefined') {
						$.each(test.guidelines.wcag, function(sc, scTest) {
							if(typeof scTest.techniques !== 'undefined') {
								$.each(scTest.techniques, function(index, technique) {
									if(typeof testAlignment.technique[technique] === 'undefined') {
										testAlignment.technique[technique] = {};
									}
									testAlignment.technique[technique][testName] = testName;
								});
							}
						});
					}
				});
				$.getJSON('/dist/guidelines/wcag.json', function(guideline) {
					$.each(guideline.guidelines, function(id, sc) {
						$tr = $('<tr>');
						$tr.append('<td rowspan="' + sc.techniques.length + '"><strong>' + id + '</strong> ' + sc.title + '</td>');
						firstRow = true;
						$.each(sc.techniques, function(techniqueId, technique) {
							if(!firstRow) {
								$tr = $('<tr>');
							}
							$tr.append('<td><strong>' + technique + '</strong> ' + guideline.techniques[technique].description + '</td>');
							if(typeof testAlignment.technique[technique] !== 'undefined') {
								$ul = $('<ul>');
								$.each(testAlignment.technique[technique], function(test) {
									$ul.append('<li><a href="http://quail.readthedocs.org/en/latest/tests/' + test +'.html">' + test + '</a></li>');
									delete tests[test];
								});
								$tr.append('<td>' + $ul.html() + '</td>');
							}
							else {
								$tr.append('<td><strong>No tests</strong></td>');
							}
							$('#guideline tbody').append($tr);
							firstRow = false;
						});
					});
					$('#loading').remove();
					$.each(tests, function(testId, test) {
						$('#orphans').append('<li><a href="http://quail.readthedocs.org/en/latest/tests/' + testId + '.html">' + testId + '</a></li>');
					});
				});
			});
		});
	})(jQuery);
