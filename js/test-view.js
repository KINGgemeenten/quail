(function($) {
	$(document).ready(function() {
		var testName = window.location.hash.replace('#', '').trim();
		if(!testName) {
			return;
		}
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
			var template = Handlebars.compile($('#test-template').html());
			$('#test').html(template(test));
		});
	});
})(jQuery);
