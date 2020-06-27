const ytSearch = require('yt-search');
const cors = require('../lib/cors');

const handler = (req, res) => {
  try {
    if(req.method === 'GET'){
      if (!req.query.searchTerm) {
        res.status(400);
        return res.send({
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
          const formattedData = videos.map(item => {
            return {
              title: item.title,
              author: {
                name: item.author.name
              },
              duration: {
                seconds: item.duration.seconds
              },
              videoId: item.videoId
            }
          });
          res.send(formattedData);
        });
      }
      return;
    }
    res.statu(404);
    return res.end();
  } catch (err) {
    res.status(500);
    res.send({
      error: 'Something went wrong...'
    });
    throw err;
  }
}

module.exports = (req,res)=>cors(req,res,handler);
