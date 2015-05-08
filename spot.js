var launcher = require('./')
var test = require('tape')

test('detection test', function (t) {
	var expected = {}

	process.argv.slice(2).forEach( function( name ) {
		expected[name] = true
	})

	launcher.detect(function (available) {
		t.pass('got detection data')
		available.forEach( function( brw ) {
			if ( expected[brw.name] ) {
				t.pass( 'found ' + brw.name + ' version ' + brw.version )
				delete expected[brw.name]
			} else {
				t.fail( 'unexpected ' + brw.name + ' version ' + brw.version )
			}
		})
		for( notfound in expected ) {
			t.fail( 'didn\'t found ' + notfound )
		}
		t.end()
	});
})
