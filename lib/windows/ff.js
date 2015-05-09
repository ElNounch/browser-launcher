var asyncify = require('dezalgo');
var queryReg = require('./queryReg');

var qryVersion = [
    'reg query "HKEY_CURRENT_USER\\Software\\Mozilla\\Mozilla Firefox" /v CurrentVersion',
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Mozilla\\Mozilla Firefox" /v CurrentVersion',
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Wow6432Node\\Mozilla\\Mozilla Firefox" /v CurrentVersion'
];
var qryPath = [
    'reg query "HKEY_CURRENT_USER\\Software\\Mozilla\\Mozilla Firefox" /s /v PathToExe',
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Mozilla\\Mozilla Firefox\\%VERSION%\\Main" /s /v PathToExe',
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\FIREFOX.EXE\\shell\\open\\command"'
];

var currentVersion;

exports.version = function(callback) {
    var cb = asyncify(callback);

    if (currentVersion) {
        return cb(null, currentVersion);
    }

    queryReg( qryVersion, function( err, version ) {
        if (version) {
            currentVersion = version;
            cb(null, version);
        } else {
            cb('unable to determine firefox version');
        }
    })
};

exports.path = function(callback) {
    var cb = asyncify(callback);

    exports.version(function(err, version) {
        if (version) {
            var queries = qryPath.map( function( q ){ return q.replace('%VERSION%', version); } );
        } else {
            var queries = qryPath;
        }
        queryReg( queries, function( err, cmd ) {
            if (cmd) {
                cb(null, cmd);
            } else {
                cb('unable to find firefox path');
            }
        })
    })
};

