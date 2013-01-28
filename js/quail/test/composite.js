/*! QUAIL quail-lib.org | quail-lib.org/license */

var accessibilityTests = { };

$.ajax({ url : '../../../src/resources/tests.json',
 async : false,
 dataType : 'json',
 cache : false,
 success : function(data) {
    if(typeof data === 'object') {
      accessibilityTests = data;
    }
}});
var quailTest = {

  results : { },

  testName : '',

  runTest : function(testName) {
    quailTest.testName = testName;
    $(document).quail({ jsonPath : '../../../src/resources',
                      guideline : [ testName ],
                      reset : true,
                      accessibilityTests : accessibilityTests,
                      complete : function(results) {
                        quailTest.results = results.results;
                      }});
  },

  confirmIsEmpty : function() {
    $.each(quailTest.results[quailTest.testName], function(index, item) {
      if(typeof item === 'undefined' ||
         (item && $(item).attr('id') && $(item).attr('id').indexOf('qunit-') !== -1) ||
         $(item).parents('#qunit-wrapper').length) {
        quailTest.results[quailTest.testName].splice(index, 1);
      }
      else {
        return false;
      }
    });
    return true;
  },

  confirmIsTag : function(tag) {
    $.each(quailTest.results[quailTest.testName], function(index, item) {
      if(typeof item === 'undefined' ||
         (item && $(item).attr('id') && $(item).attr('id').indexOf('qunit-') !== -1) ||
         $(item).parents('#qunit-wrapper').length) {
        quailTest.results[quailTest.testName].splice(index, 1);
      }
    });
    if(typeof quailTest.results[quailTest.testName][0] === 'undefined') {
      return false;
    }
    return quailTest.results[quailTest.testName][0].is(tag);
  }
};