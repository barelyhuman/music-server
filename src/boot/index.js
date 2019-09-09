'use strict';

module.exports = {

    processBoot: function (app) {
        const fs = require('fs');
        const constants = require('../constants');

        return new Promise((resolve, reject) => {
            fs.readdir(__dirname, (err, files) => {
                if (err) {
                    return reject(err);
                }

                const bootableFiles = files.filter(file => constants.GLOBFILEEXCEPTIONS.indexOf(file) < 0).sort();

                bootableFiles.reduce((acc, bootableFile) => {
                    return acc.then(() => require('./' + bootableFile)(app));
                }, Promise.resolve())
                    .then(resolve)
                    .catch(reject);

            });
        });
    }

};