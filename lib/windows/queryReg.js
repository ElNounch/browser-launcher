var asyncify = require('dezalgo');
var exec = require('child_process').exec;

var regex = /\sREG_SZ\s+(.*)/;


module.exports = exports = function queryReg( queries, callback ) {
    var result = {};
    var pending = queries.length;

    return _queryReg( queries, asyncify(callback), queries.length );

    function _queryReg( queries, callback, len ) {
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
                    return _queryReg( todo, callback, len - 1 );
                } else {
                    return callback('not found');
                }
            }
        })
    }
}
