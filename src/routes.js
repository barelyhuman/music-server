'use strict';

module.exports = (app) => {

    const { SearchController } = app.Controllers;
    const router = require('express').Router();

    router.route('/search')
        .get(SearchController.search)


    router.route('/play')
        .get(SearchController.play)


    return router;

}