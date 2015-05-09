var asyncify = require('dezalgo');
var queryReg = require('./queryReg');

var qryVersion = [
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Internet Explorer" /v svcVersion',
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Internet Explorer" /v Version'
];
var qryPath = [
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\IEXPLORE.EXE\\shell\\open\\command"'
];
var defaultPath = '%ProgramFiles%\\Internet Explorer\\iexplore.exe';

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
            exports.version(function(err, version) {
                if (version) {
                    cb(null, defaultPath);
                } else {
                    cb('unable to determine ie path');
                }
            })
        }
    })
};

exports.path = function(callback) {
    var cb = asyncify(callback);

    queryReg( qryPath, function( err, cmd ) {
        if (cmd) {
            cb(null, cmd);
        } else {
            cb('unable to find ie path');
        }
    })
};
