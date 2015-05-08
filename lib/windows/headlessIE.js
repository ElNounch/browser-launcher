try {
    var headlessIE = require('headlessIE');
} catch (e) {
    delete headlessIE;
}

if ((process.platform === 'win32') && (typeof headlessIE !== 'undefined')) {
    exports.version = headlessIE.version;
    exports.path = headlessIE.command;

} else {
    exports.version = function(callback) {
        callback('headlessIE unavailable');
    };

    exports.path = function(callback) {
        callback('headlessIE unavailable');
    }
};
