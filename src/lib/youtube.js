
import ytsr from 'ytsr'
import conch from '@barelyreaper/conch'

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

export const formatToMusicReponse = (ytSearchResponseObject) => {
  if (!ytSearchResponseObject) {
    return {}
  }
  return {
    title: ytSearchResponseObject && ytSearchResponseObject.title,
    author: {
      name: ytSearchResponseObject && ytSearchResponseObject.author && ytSearchResponseObject.author.name
    },
    duration: {
      seconds: ytSearchResponseObject && ytSearchResponseObject.duration && ytSearchResponseObject.duration.seconds || 0
    },
    videoId: ytSearchResponseObject.id
  }
}

export const searchYoutubeForTracks = async (tracks) => {
  const data = await conch(
    tracks,
    (track) => {
      return matchSong(track)
    },
    {
      limit: 100
    })
  return data
}
