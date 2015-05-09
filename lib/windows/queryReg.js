var asyncify = require('dezalgo');
var exec = require('child_process').exec;

var regex = /\sREG_SZ\s+(.*)/;

function _queryReg( queries, callback ) {
    if( Array.isArray( queries ) ) {
        var query = queries[0];
        var todo = queries.slice(1);
    } else {
        var query = queries;
        var todo = [];
    }

    exec(query, function (err, stdout) {
        var match;
        var data = stdout.split('\r\n');
        data.forEach(function(line) {
            var res = regex.exec(line);
            if ( res !== null ) {
                match = res[1].replace(/"/g, '').trim();
            }
        });

        if( typeof match !== 'undefined' ) {
            return callback( null, match );
        } else {
            if( todo.length ) {
                return _queryReg( todo, callback );
            } else {
                return callback('not found');
            }
        }
    })
}

module.exports = exports = function queryReg( queries, callback ) {
    return _queryReg( queries, asyncify(callback) );
}
