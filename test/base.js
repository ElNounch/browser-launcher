var launcher = require('../')
var test = require('tape')
var express = require('express')

function createRandomLocalAddress() {
    function upTo( max ) {
        return Math.floor( Math.random() * (max + 1) )
    }
    return '127.' + upTo(255) + '.' + upTo(255) + '.' + (upTo(252) + 2)
}

test('detection test', function (tM) {
    launcher(function (err,launch) {
        if( err ) {
            tM.fail( 'failed scanning for browsers :' + err )
        } else {
            tM.pass( 'successfully scanned for browsers' )
            launch.browsers.local.forEach( function( brw ) {
                tM.skip( 'detected ' + brw.name + ' version ' + brw.version )
                checkLauncher( tM, launch, brw.name )
            })
        }
        tM.end()
    })
})

function checkLauncher( tM, launch, browser ) {
    tM.test('testing ' + browser, { timeout: 30000 }, function (t) {
        t.plan(5)
        var app = express()
        var server
        var proc
        var timer
        var job_done = false
        var local_addr = createRandomLocalAddress()

        app.get('/entrance', function (req, res) {
          res.setHeader('Connection', 'close')
          res.setHeader('Content-Type', 'text/html')
          res.send('<html><head><script>location.href="/javascript_passed"</script><body></body></html>')
          res.end()
          t.pass('entrance page accessed')
        })
        app.get('/javascript_passed', function (req, res) {
          res.setHeader('Connection', 'close')
          res.setHeader('Content-Type', 'text/plain')
          res.send('Job done !')
          res.end()
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

        var opts = { browser: browser }
        launch( 'http://' + local_addr + ':8000/entrance', opts, function(err, pid) {
            t.ok( !err, 'successfully launched browser' )
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