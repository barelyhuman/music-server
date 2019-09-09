const ytSearch = require('yt-search');
const ytdlcore = require('ytdl-core');

const controllerConfig = {
    name: 'SearchController',
    controller: {}
};


controllerConfig.controller.search = (req, res) => {
    ytSearch({
        query:req.query.searchTerm,
        pageStart:0,
        pageEnd:1
    },function(err,r){
        if(err) throw err;
        const videos = r.videos;
        res.send(videos);
    });
};

controllerConfig.controller.play = (req, res) => {
    ytdlcore(formatUrl(req.query.audioId),{format:'audioonly'}).pipe(res); 
}


function formatUrl(audioId){
    return 'http://www.youtube.com/watch?v='+audioId
}



module.exports = controllerConfig;