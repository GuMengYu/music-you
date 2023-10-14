import { isArray } from 'lodash-es'
import { Link as RouterLink } from 'react-router-dom'
import type { Album } from '@/types'

export default function AlbumLink({ album }: { album: Album[] | Album }) {
  let albums = []
  if (isArray(album))
    albums = album
  else
    albums = [album]

  return <span>
    {
      albums.map((al, idx) => {
        if (al?.id && al?.name) {
          return <RouterLink
            key={al.id}
            to={`/album/${al.id}`}>
            {al.name}
            {idx !== albums.length - 1 ? ', ' : ''}
          </RouterLink>
        }
        else {
          return <span>未知</span>
        }
      })
    }
  </span>
}
