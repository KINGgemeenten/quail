(function($) {
	var config = {};
	var quailParts = ['components', 'strings', 'custom'];
	var jsHead = [
		'/*! QUAIL quailjs.org | quailjs.org/license */',
		'/*! Built with the Quail builder at quailjs.org/build */',
		';(function($) {'
	];

	$.getJSON('/dist/tests.min.json', function(tests) {
		var updateConfig = function() {
			config = { tests: { },
								 components: { },
								 strings: { },
								 libraries: { },
								 custom: { }
								 };
			$.each(tests, function(testName, test) {
				if(!$('#' + testName).is(':checked')) {
					return;
				}
					delete test.testName;
					config.tests[testName] = test;
				if(typeof test.components !== 'undefined') {
					$.each(test.components, function(index, component) {
						config.components[component] = component;
					});
				}
				if(test.type == 'custom') {
					config.custom[testName] = testName;
				}
				if(typeof test.strings !== 'undefined') {
					$.each(test.strings, function(index, strings) {
						var string = (strings.search(/\./) !== -1) ? strings.substr(0, strings.search(/\./)) : strings;
						config.strings[string] = string;
					});
				}
			});
		};

		var updateForm = function() {
			$(':checkbox').each(function() {
				$(this).removeAttr('checked');
			})
			$.each(config.tests, function(testName, test) {
				$('#' + testName + ':checkbox').attr('checked', 'checked');
			});
		}

		var processedTests = [];
		var template = Handlebars.compile($('#builder-template').html());
		$.each(tests, function(testName, test) {
			test.testName = testName;
			test.finalGuidelines = [];
			processedTests.push(test);
		});
		var gistId = window.location.hash.replace('#', '').trim();
		if(gistId.length) {
			updateConfig();
			$.ajax({
	      url: 'https://api.github.com/gists/' + gistId,
	      type: 'GET',
	      dataType: 'json',
	      success : function(data) {
	      	config = JSON.parse(data.files['quail-config.json'].content);
			  	updateForm();
	      }
	    });
		}

		$('#builder-tests').prepend(template({ tests: processedTests }));
		$('#builder').on('submit', function(event) {
			console.log(event);
			updateConfig();
			var js = jsHead;
			js.push('window.quailTests = ' + JSON.stringify(config.tests, null, 2) + ';');
			var core = $.ajax({ async: false, url: '/src/js/core.js' });
			js.push(core.responseText);
			$.each(quailParts, function(index, part) {
				$.each(config[part], function(quailPart) {
					var code = $.ajax({ async: false, url: '/src/js/' + part + '/' + quailPart + '.js'});
					js.push(code.responseText);
				});				
			});
			js.push('})(jQuery);');
			var blob = new Blob([js.join("\n")], {type: "text/javascript;charset=utf-8"});
			saveAs(blob, "quail-custom.js");
		});
		$('#download-config').on('click keyup', function(event) {
			event.preventDefault();
			updateConfig();
			var blob = new Blob([JSON.stringify(config, null, 2)], {type: "text/json;charset=utf-8"});
			saveAs(blob, "quail-config.json");
		});
		$('#download-link').on('click keyup', function(event) {
			event.preventDefault();
			var data = {
	      "description": "Quail builder configuration",
	      "public": true,
	      "files": {
	        "quail-config.json": {
	          "content": JSON.stringify(config, null, 2)
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
	      window.location.hash = result.id;
	    })
	    .error(function(err) {
	      showError('<strong>Ruh roh!</strong> Could not save gist file, configuration not saved.', err)
	    })
		});
		$('#builder :checkbox').on('change', updateConfig);
	});
})(jQuery);