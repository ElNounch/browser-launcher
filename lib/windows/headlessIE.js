var asyncify = require('dezalgo');
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
        var cb = asyncify(callback);

        cb('headlessIE unavailable');
    };

    exports.path = function(callback) {
        var cb = asyncify(callback);

        cb('headlessIE unavailable');
    }
};
