const ytdlcore = require('ytdl-core');
const cors = require('../../lib/cors');

const handler = (req, res) => {
  try {
    if (req.method === 'GET') {
      const options = {};

      let parts = [];
      let partialstart, partialend, start, end;
      if (req.headers.range) {
        parts = req.headers.range.replace(/bytes=/, '').split('-');
        partialstart = parts[0];
        partialend = parts[1] || false;
        start = parseInt(partialstart, 10);
      }

      const url = formatUrl(req.query.audioId);

      const validUrl = ytdlcore.validateURL(url);

      if (!validUrl) {
        res.status(400);
        res.send({
          success: false,
          message: 'Video not playable',
        });
      }

      ytdlcore(url, options).on('response', (response) => {
        const totalLength = response.headers['content-length'];

        end = partialend ? parseInt(partialend, 10) : totalLength - 1;

        if (req.headers.range) {
          options.range = {
            start,
            end,
          };

          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader(
            'Content-Range',
            'bytes ' + start + '-' + end + '/' + totalLength
          );
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Transfer-Encoding', 'chunked');
          res.statusCode = 206;
        }

        ytdlcore(url, options).pipe(res);
      });

      return;
    }
    res.status(404);
    return res.end();
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send({
      error: 'Something went wrong...',
    });
    throw err;
  }
};

function formatUrl(audioId) {
  return 'http://www.youtube.com/watch?v=' + audioId;
}

module.exports = (req, res) => cors(req, res, handler);
