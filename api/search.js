const ytSearch = require('yt-search');
const cors = require('../lib/cors');

const handler = (req, res) => {
  try {
    if(req.method === 'GET'){
      if (!req.query.searchTerm) {
        res.statusCode=400;
        res.write(JSON.stringify({
          message: "Empty Search Term"
        },null,2));
        res.end();
        return 
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
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(formattedData,null,2));
          res.end();
        });
      }
      return;
    }
    res.statusCode = 404;
    res.end();
    return;
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
      error: 'Something went wrong...'
    }));
    res.statusCode = 500;
    res.end();
    throw err;
  }
}

module.exports = (req,res)=>cors(req,res,handler);
