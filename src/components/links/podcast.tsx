import { isArray } from 'lodash-es'
import { Link as RouterLink } from 'react-router-dom'
import type { Podcast } from '@/types'

export default function PodcastLink({ podcast }: { podcast: Podcast[] | Podcast }) {
  let podcasts = []
  if (isArray(podcast))
    podcasts = podcast
  else
    podcasts = [podcast]

  return <span>
    {
      podcasts.map((item, idx) => {
        if (item?.id && item?.name) {
          return <RouterLink
            key={item.id}
            to={`/podcast/${item.id}`}>
            {item.name}
            {idx !== podcasts.length - 1 ? ', ' : ''}
          </RouterLink>
        }
        else {
          return <span>未知</span>
        }
      })
    }
  </span>
}
