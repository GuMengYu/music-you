import { useQuery } from '@tanstack/react-query'
import { random } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { filter } from 'lodash-es'
import Col from '@/components/Col'
import { newAlbums } from '@/api/album'
import { getCatList } from '@/api/playlist'
import { getTopList, topMvs } from '@/api/top'
import { getColorTable } from '@/util/metadata'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import { GridType } from '@/hooks/useResponsiveGrid'
import VideoCover from '@/components/cover/VideoCover'
import MdTag from '@/components/Tag'
import PageTransition from '@/components/PageTransition'
import ExploreSkeleton from '@/components/skeleton/ExploreSkeleton'

interface Tag {
  color: string
  name: string
}
const colors = Object.values(getColorTable())
const boardId = [
  60198 /* 美国Billboard排行榜 */, 180106 /* UK排行榜周榜 */, 19723756 /* 飙升榜 */, 2884035 /* 原创榜 */,
  5059661515 /* 云音乐民谣榜 */, 7775163417 /* 赏音榜 */,
]
export default function ExplorePage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery(['explore'], async () => {
    const [{ sub }, { albums }, { data: mvs }, { list: topList }] = await Promise.all([
      getCatList(),
      newAlbums({ limit: 10 }),
      topMvs(),
      getTopList(),
    ])
    let tags = []
    tags = sub.slice(0, 20).map((i: Tag) => {
      i.color = colors[random(0, colors.length)]
      return i
    })
    tags.unshift({
      color: colors[random(0, colors.length)],
      name: '官方',
    })
    return {
      tags,
      albums,
      mvs,
      topList: filter(topList, i => boardId.includes(i.id)),
    }
  }, {
    staleTime: 5 * 60 * 1000,
  })
  return <PageTransition>
    {
      isLoading
        ? <ExploreSkeleton/>
        : <div className='flex flex-col gap-4 pr-2'>
        <Col title='歌单广场' variant='h6' more={'/moods_and_genres/'}>
          <GridRow>
            {
              data?.tags?.map((i) => {
                return <MdTag onClick={() => {
                  navigate(`/moods_and_genres/${i.name}?color=${encodeURIComponent(i.color)}`)
                }} tagcolor={i.color} to={`/${i.name}`} key={i.name} name={i.name} />
              })
            }
          </GridRow>
        </Col>
        <Col title='新专辑' variant='h6' more={'/list_collection/new_album'}>
          <GridRow singleLine>
            {
              data?.albums?.map((i) => {
                return <Cover data={i} type='album' key={i.id} />
              })
            }
          </GridRow>
        </Col>
        <Col title='排行榜' variant='h6' more='/list_collection/leaderboard'>
          <GridRow>
            {
              data?.topList?.map((i) => {
                return <Cover data={i} type='playlist' key={i.id} />
              })
            }
          </GridRow>
        </Col>
        <Col title='新的音乐视频' variant='h6' more='/list_collection/new_video'>
          <GridRow singleLine rowType={GridType.B}>
            {
              data?.mvs?.map((i) => {
                return <VideoCover data={i} key={i.id} />
              })
            }
          </GridRow>
        </Col>
      </div>
    }
  </PageTransition>
}
