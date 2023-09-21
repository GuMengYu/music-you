import { isArray } from 'lodash-es'
import { Link as RouterLink } from 'react-router-dom'
import type { Artist } from '@/types'

export default function ArtistLink({ artist }: { artist: Artist[] | Artist }) {
  let artists = []
  if (isArray(artist)) 
    artists = artist
  else 
    artists = [artist]
  
  return <span>
    {
      artists.map((artist, idx) => {
        return (<RouterLink
          key={artist.id}
          to={`/artist/${artist.id ?? artist.userId}`}>
          {artist.name ?? artist.userName}
          { idx !== artists.length - 1 ? ', ' : '' }
        </RouterLink>)
      })
    }
  </span>
}
