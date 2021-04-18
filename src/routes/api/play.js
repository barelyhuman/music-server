import ytdlcore from 'ytdl-core'
import cors from '../../lib/cors'

const handler = (req, res) => {
  try {
    if (req.method === 'GET') {
      const options = {}

      let parts = []
      let partialstart, partialend, start, end
      if (req.headers.range) {
        parts = req.headers.range.replace(/bytes=/, '').split('-')
        partialstart = parts[0]
        partialend = parts[1] || false
        start = parseInt(partialstart, 10)
      }

      const url = formatUrl(req.query.audioId)

      const validUrl = ytdlcore.validateURL(url)

      if (!validUrl) {
        res.status(400)
        return res.send({
          success: false,
          message: 'Video not playable'
        })
      }

      const stream = ytdlcore(url, options);
      stream.on('response', function (response) {
        try {
          const totalLength = response.headers['content-length']

          end = partialend ? parseInt(partialend, 10) : totalLength - 1

          if (req.headers.range) {
            options.range = {
              start,
              end
            }

            res.setHeader('Accept-Ranges', 'bytes')
            res.setHeader(
              'Content-Range',
              'bytes ' + start + '-' + end + '/' + totalLength
            )
            res.setHeader('Content-Type', 'audio/mpeg')
            res.setHeader('Transfer-Encoding', 'chunked')
            res.statusCode = 206
          }

          stream.pipe(res).on('error', (err) => {
            console.log(err)
            res.status(500)
            res.send({
              error: 'Something went wrong...'
            })
          })
        } catch (err) {
          console.log(err)
        }
      })

      return
    }
    res.status(404)
    return res.end()
  } catch (err) {
    console.error(err)
    res.status(500)
    return res.send({
      error: 'Something went wrong...'
    })
  }
}

function formatUrl (audioId) {
  return 'http://www.youtube.com/watch?v=' + audioId
}

export default (req, res) => cors(req, res, handler)
