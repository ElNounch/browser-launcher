var asyncify = require('dezalgo');
var queryReg = require('./queryReg');

var qryVersion = [
    'reg query "HKEY_CURRENT_USER\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv'
];
var qryPath = [
    'reg query "HKEY_CURRENT_USER\\Software\\Google\\Update" /v LastInstallerSuccessLaunchCmdLine',
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\Google Chrome\\shell\\open\\command'
];
var defaultPath = '%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe';

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
            cb('unable to determine chrome version');
        }
    })
};

exports.path = function(callback) {
    var cb = asyncify(callback);

    queryReg( qryPath, function( err, cmd ) {
        if (cmd) {
            cb(null, cmd);
        } else {
            exports.version(function(err, version) {
                if (version) {
                    cb(null, defaultPath);
                } else {
                    cb('unable to determine chrome path');
                }
            })
        }
    })
};
