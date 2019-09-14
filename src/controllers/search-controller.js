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
        filter: 'audioonly'
    };

    let parts = [];
    let partialstart,
        partialend, start, end;
    if (req.headers.range) {
        parts = req.headers.range.replace(/bytes=/, '').split("-");
        partialstart = parts[0];
        partialend = parts[1] || false;
        start = parseInt(partialstart, 10);
    }


    const url = formatUrl(req.query.audioId);

    ytdlcore(url, options)
        .on('response', (data) => {
            const totalLength = data.headers['content-length'];
            end = partialend ? parseInt(partialend, 10) : totalLength - 1;

            if (req.headers.range) {

                options.range = {
                    start,
                    end
                };

                res.set('Content-Range', 'bytes ' + start + '-' + end + '/' + totalLength);
                res.set('Content-Type', 'application/octet-stream');
            }

            ytdlcore(url, options).pipe(res);

        });
}


function formatUrl(audioId) {
    return 'http://www.youtube.com/watch?v=' + audioId
}



module.exports = controllerConfig;