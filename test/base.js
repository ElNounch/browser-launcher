var launcher = require('../')
var test = require('tape')
var express = require('express')

function createRandomLocalAddress() {
    function upTo( max ) {
        return Math.floor( Math.random() * (max + 1) )
    }
    return '127.' + upTo(255) + '.' + upTo(255) + '.' + (upTo(252) + 2)
}

test('detection test', function (t) {
    launcher(function (err,launch) {
        t.ok( !err, 'no error while scanning for browsers' )
        launch.browsers.local.forEach( function( brw ) {
            t.skip( 'detected ' + brw.name + ' version ' + brw.version )
            checkLauncher( t, launch, brw.name )
        })
        t.end()
    })
})

function checkLauncher( t, launch, browser ) {
    t.test('testing ' + browser, { timeout: 30000 }, function (t) {
        t.plan(5)
        var app = express()
        var server
        var proc
        var timer
        var job_done = false
        var local_addr = createRandomLocalAddress()

        app.get('/entrance', function (req, res) {
          res.setHeader( 'Connection', 'close' )
          res.send('<html><head><script>location.href="/javascript_passed"</script><body></body></html>')
          t.pass('entrance page accessed')
        })
        app.get('/javascript_passed', function (req, res) {
          res.setHeader( 'Connection', 'close' )
          res.send('Job done !')
          t.pass('javascript worked')
          job_done = true
          clearTimeout( timer )
          proc.kill()
          server.close()
        })

        server = app.listen(8000, local_addr)

        timer = setTimeout( function onTimeOut() {
            proc.kill()
            server.close()
        }, 25000)

        launch(
            'http://' + local_addr + ':8000/entrance',
            {
                browser: browser
            },
            function(err, pid) {
                t.ok( !err, 'no error while launching browser' )
                proc = pid

                proc.on('exit', function onBrowserExit( code, signal ) {
                    if( job_done ) {
                        t.ok( code === null, 'exit code is correct')
                        t.ok( signal === 'SIGTERM', 'killed by signal')
                    }
                })
            })
    })
}