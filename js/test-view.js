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
			$('#raw').html(JSON.stringify(test, null, 2));
			$('#test-name').html(test.title.en);
			$('#description').html(test.description.en);
			$('#quail-name').html(testName);
			$('#type').html(test.type);
			$('#selector').html(test.selector);
		});
	});
})(jQuery);
