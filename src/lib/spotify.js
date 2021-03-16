import ytsr from 'ytsr'

import SpotifyWebApi from 'spotify-web-api-node'

import pMap from 'p-map'

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

export const searchPlaylist = async (
  playlistLink = process.env.TESTPLAYLIST
) => {
  try {
    // check and init the client if needed
    await initClient()
    const playlist = await spotifyApi.getPlaylist(playlistLink)

    const tracksFromPlaylist = playlist.body.tracks.items.map(
      formatSpotifyTrackToMusicObjects
    )

    const data = await pMap(
      tracksFromPlaylist,
      (track) => {
        return matchSong(track)
      }
      ,
      { concurrency: 10 }
    )
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const matchSong = async (
  trackObject = {
    title: '',
    author: [
      {
        name: ''
      }
    ]
  }
) => {
  const trackNameWithArtist =
    trackObject.title +
    '-' +
    (trackObject.author || []).map((item) => item.name).join(',')

  const response = await ytsr(trackNameWithArtist, {
    limit: 1
  })
  return formatToMusicReponse(response.items[0])
}

export const formatSpotifyTrackToMusicObjects = (spotifyTrack) => {
  return {
    title: spotifyTrack.track.name,
    author: spotifyTrack.track.artists.map((item) => ({
      name: item.name
    }))
  }
}

export const formatToMusicReponse = (ytSearchResponseObject) => {
  return {
    title: ytSearchResponseObject.title,
    author: {
      name: ytSearchResponseObject.author.name
    },
    duration: {
      seconds: ytSearchResponseObject.duration.seconds
    },
    videoId: ytSearchResponseObject.id
  }
}

if (require.main === module) {
  require('dotenv').config()
  initClient().then((_) => searchPlaylist())
}
