const ytdlcore = require('ytdl-core');
const cors = require('../lib/cors');

const handler = (req, res) => {
  try {
    if (req.method === 'GET') {
      const options = {};

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

      const validUrl = ytdlcore.validateURL(url);


      if (!validUrl) {
        res.statusCode = 400
        res.write(JSON.stringify({
          success: false,
          message: "Video not playable"
        }));
        res.end();
      }

      ytdlcore(url, options).on('response', (response) => {


        const totalLength = response.headers['content-length'];

        end = partialend ? parseInt(partialend, 10) : totalLength - 1;

        if (req.headers.range) {

          options.range = {
            start,
            end
          };

          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + totalLength);
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Transfer-Encoding', 'chunked');
          res.statusCode = 206;
        }

        ytdlcore(url, options).pipe(res);

      });

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


function formatUrl(audioId) {
  return 'http://www.youtube.com/watch?v=' + audioId
}

module.exports = (req,res)=>cors(req,res,handler);
