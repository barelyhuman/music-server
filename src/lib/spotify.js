
import SpotifyWebApi from 'spotify-web-api-node'

const checkWebURL = /^http[s]*:\/\/open.spotify.com\/playlist\/(\w+)/i
const checkSpotifyURI = /spotify:playlist:(\w+)/

let spotifyApi

const initClient = async () => {
  if (!spotifyApi) {
    spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })

    const data = await spotifyApi.clientCredentialsGrant()
    await spotifyApi.setAccessToken(data.body.access_token)
  }
  return true
}

// credentials are optional

export const parsePlayistURL = (urlString) => {
  let match = String(urlString).match(checkWebURL)

  if (!match) {
    match = String(urlString).match(checkSpotifyURI)
    return match[1]
  }
  return match[1]
}

export const isSpotifyLink = (urlString) => {
  if (
    !(
      String(urlString).match(checkWebURL) ||
      String(urlString).match(checkSpotifyURI)
    )
  ) {
    return false
  }
  return true
}

export const getAllTracksFromPlaylist = async (playlistLink
= process.env.TESTPLAYLIST
) => {
  try {
    // check and init the client if needed
    await initClient()
    let tracks = []
    const playlist = await spotifyApi.getPlaylist(playlistLink)
    const totalItems = playlist.body.tracks.total

    tracks = tracks.concat(playlist.body.tracks.items.map(
      formatSpotifyTrackToMusicObjects
    ))
    let offset = 100
    const limit = 100
    while (tracks.length < totalItems) {
      const response = await spotifyApi.getPlaylistTracks(playlistLink, {
        offset: offset,
        limit: limit
      })
      tracks = tracks.concat(response.body.items.map(formatSpotifyTrackToMusicObjects))
      offset += limit
    }

    return tracks
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const formatSpotifyTrackToMusicObjects = (spotifyTrack) => {
  return {
    title: spotifyTrack.track.name,
    author: spotifyTrack.track.artists.map((item) => ({
      name: item.name
    }))
  }
}
