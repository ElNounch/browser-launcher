var launcher = require('../')
var test = require('tape')
var express = require('express')
var byebye = require('byebye')

function createRandomLocalAddress() {
    function upTo( max ) {
        return Math.floor( Math.random() * (max + 1) )
    }
    return '127.' + upTo(255) + '.' + upTo(255) + '.' + (upTo(252) + 2)
}

test('detection test', { timeout: 120000 }, function (tM) {
    launcher(function (err,launch) {
        if( err ) {
            tM.fail( 'failed scanning for browsers :' + err )
        } else {
            tM.pass( 'successfully scanned for browsers' )
            launch.browsers.local.forEach( function( brw ) {
                tM.skip( 'detected ' + brw.name + ' version ' + brw.version )
                tM.test( 'testing ' + brw.name, { timeout: 35000 }, function( t ) {
                    checkLauncher( t, launch, brw.name )
                })
            })
        }
        tM.end()
    })
})

function checkLauncher( t, launch, browser ) {
    var http = require('http')
    var app = express()
    var server
    var proc
    var timer
    var job_done = false
    var local_addr = createRandomLocalAddress()

    t.plan(4)
    app.get('/entrance', function (req, res) {
      res.setHeader('Content-Type', 'text/html')
      res.send('<html><head><script>location.href="/javascript_passed"</script><body></body></html>')
      res.end()
      t.pass('entrance page accessed')
    })
    app.get('/javascript_passed', function (req, res) {
      res.setHeader('Content-Type', 'text/plain')
      res.send('Job done !')
      res.end()
      t.pass('javascript worked')
      job_done = true
      clearTimeout( timer )
      byebye( proc )
      server.close()
    })

    server = app.listen(8000, local_addr)

    timer = setTimeout( function onTimeOut() {
        byebye( proc )
        server.close()
    }, 25000)

    var opts = { browser: browser }
    launch( 'http://' + local_addr + ':8000/entrance', opts, function(err, pid) {
        t.ok( !err, 'successfully launched browser' )
        proc = pid

        proc.stdout.on( 'data', function onStdout( data ) {
            t.comment( 'console message : ' + data )
        })
        
        proc.stderr.on( 'data', function onStderr( data ) {
            t.comment( 'error message : ' + data )
        })

        proc.on('exit', function onBrowserExit( code, signal ) {
            if( job_done ) {
                t.pass( 'browser quitted' )
            } else {
                t.fail( 'unexpected browser quit' )
            }
        })
    })
}