'use strict';


module.exports = (app) => {
    const fs = require('fs');
    const path = require('path');
    const constants = require('../constants');

    app.Controllers = {};

    return new Promise(function (resolve, reject) {

        fs.readdir(constants.CONTROLLERSPATH, (err, files) => {
            if (err) {
                return reject(err);
            }

            files.forEach(file => {
                const module = require(path.join(constants.CONTROLLERSPATH, file));
                app.Controllers[module.name] = module.controller;
            });

            resolve();
        });

    });

}





