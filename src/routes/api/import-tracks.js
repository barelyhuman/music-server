import cors from '../../lib/cors'
import {
  getAllTracksFromPlaylist,
  isSpotifyLink,
  parsePlayistURL
} from '../../lib/spotify'

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const playlistUrl = req.query.url

      if (!isSpotifyLink(playlistUrl)) {
        res.status(400)
        res.send({
          success: false,
          message: 'Not a spotify playlist'
        })
        return
      }

      const playistId = parsePlayistURL(playlistUrl)

      const tracks = await getAllTracksFromPlaylist(playistId)

      res.send({
        data: tracks
      })
    }
    res.status(404)
    return res.end()
  } catch (err) {
    console.error(err)
    res.status(500)
    res.send({
      error: 'Something went wrong...'
    })
    throw err
  }
}

export default (req, res) => cors(req, res, handler)
