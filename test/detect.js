var launcher = require('../')
var test = require('tape')

test('detection check', function (t) {
    var expected = {}
    var dry_run = true

    if( ( process.argv.length >= 2 ) && ( process.argv[2] == '--expect' ) ) {
        process.argv.slice(3).forEach( function( name ) {
            expected[name] = true
        })
        dry_run = false
    }

    launcher.detect(function (available) {
        t.pass('got detection data')
        available.forEach( function( brw ) {
            if( dry_run || expected[brw.name] ) {
                t.pass( 'found "' + brw.name + '" version ' + brw.version )
                if( expected[brw.name] ) {
                    delete expected[brw.name]
                }
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
