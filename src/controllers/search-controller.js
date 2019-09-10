const ytSearch = require('yt-search');
const ytdlcore = require('ytdl-core');

const controllerConfig = {
    name: 'SearchController',
    controller: {}
};


controllerConfig.controller.search = (req, res) => {
    if (!req.query.searchTerm) {
        return res.status(400).send({
            message: "Empty Search Term"
        });
    }

    if (req.query.searchTerm) {
        ytSearch({
            query: req.query.searchTerm,
            pageStart: 0,
            pageEnd: 1
        }, function (err, r) {
            if (err) throw err;
            const videos = r.videos;
            res.send(videos);
        });
    }
};

controllerConfig.controller.play = (req, res) => {
    const options = {
        format:'audioonly'
    };

    if(req.headers.range){
        const rangeFromHeader = req.headers.range.replace(/bytes=/,'');

      options.range = rangeFromHeader;
        
    }

    res.status(206);
    ytdlcore(formatUrl(req.query.audioId), options).pipe(res);
}


function formatUrl(audioId) {
    return 'http://www.youtube.com/watch?v=' + audioId
}



module.exports = controllerConfig;