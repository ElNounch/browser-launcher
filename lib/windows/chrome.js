var path_lib = require('path');
var asyncify = require('dezalgo');
var queryReg = require('./queryReg');

var qryVersion = [
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Google Chrome" /v Version',
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Google Chrome" /v Version',
    'reg query "HKEY_CURRENT_USER\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv'
];
var qryPath = [
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\Google Chrome\\shell\\open\\command"',
    'reg query "HKEY_CURRENT_USER\\Software\\Google\\Update" /v LastInstallerSuccessLaunchCmdLine'
];
var qryLocation = [
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Google Chrome" /v InstallLocation',
    'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Google Chrome" /v InstallLocation'
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
            queryReg( qryLocation, function( err, location ) {
                if (location) {
                    cb(null, path_lib.join( location, 'chrome.exe' ) );
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
        }
    })
};
