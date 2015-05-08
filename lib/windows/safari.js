var asyncify = require('dezalgo');
var queryReg = require('./queryReg');

var qryVersion = [
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Apple Computer, Inc.\\Safari" /v Version'
];
var qryPath = [
    'reg query "HKEY_LOCAL_MACHINE\\Software\\Apple Computer, Inc.\\Safari" /v BrowserExe'
];

exports.version = function(callback) {
    var cb = asyncify(callback);

    queryReg( qryVersion, function( err, version ) {
        if (version) {
            cb(null, version);
        } else {
            cb('unable to determine safari version');
        }
    })
};

exports.path = function(callback) {
    var cb = asyncify(callback);

    queryReg( qryPath, function( err, cmd ) {
        if (cmd) {
            cb(null, cmd);
        } else {
            cb('unable to find safari path');
        }
    })
};
