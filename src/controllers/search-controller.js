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
        format: 'audioonly'
    };

    if (req.headers.range) {
        const bytes = req.headers.range.replace(/bytes=/, '').split('-');
        const partialStart = parseInt(bytes[0], 10);
        const partialEnd = parseInt(bytes[1], 10);
        if (partialEnd) {
            options.range = {
                start: partialStart,
                end: partialEnd
            };
        }
    };

    ytdlcore(formatUrl(req.query.audioId), options)
        .on('response', (data) => {
            const totalLength = data.headers['content-length'];
            // if (options.range) {
            //     const chunkSize = (options.range.end - options.range.start) + 1;
            //     res.set('Accept-Ranges', 'bytes');
            //     res.set('Content-Range', `bytes ${options.range.start}-${options.range.end}/${totalLength}`);
            //     res.set('Content-Type', "audio/mp3");
            //     res.set('Content-Length', chunkSize);
            //     res.status(206);
            // } else {
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Length', totalLength);
            res.set('Content-Range', `bytes 0-${totalLength - 1}/${totalLength}`);
            res.status(206);
            // }
        }).pipe(res);
}


function formatUrl(audioId) {
    return 'http://www.youtube.com/watch?v=' + audioId
}



module.exports = controllerConfig;