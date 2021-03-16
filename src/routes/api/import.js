import cors from '../../lib/cors'
import { searchYoutubeForTracks } from '../../lib/youtube'

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const trackList = req.body.tracks
      const tracks = await searchYoutubeForTracks(trackList)
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
