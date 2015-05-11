var launcher = require('../')
var test = require('tape')

test('detection check', function (t) {
    var expected = {}

    if( ( process.argv.length >= 2 ) && ( process.argv[2] == '--expect' ) ) {
        process.argv.slice(3).forEach( function( name ) {
            expected[name] = true
        })
    } else {
        expected = {}
    }

    launcher.detect(function (available) {
        t.pass('got detection data')
        available.forEach( function( brw ) {
            if ( expected[brw.name] ) {
                t.pass( 'found "' + brw.name + '" version ' + brw.version )
                delete expected[brw.name]
            } else {
                t.comment( 'unexpected "' + brw.name + '" version ' + brw.version )
            }
        })
        for( notfound in expected ) {
            t.fail( 'didn\'t found "' + notfound + '"')
        }
        t.end()
    });
})
