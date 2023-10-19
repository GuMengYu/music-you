import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarToday,
  Favorite,
  Radar as RadarIcon,

} from '@mui/icons-material'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import { useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import ShortCut from './home/shortcut'
import { GridType } from '@/hooks/useResponsiveGrid'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import {
  personalizedPlaylist,
  personalizedRadar,
} from '@/api/personalized'
import Col from '@/components/Col'
import { specialType } from '@/util/metadata'
import { getPlaylistDetail } from '@/api/playlist'
import { useUserStore } from '@/store/user'
import PageTransition from '@/components/PageTransition'
import HomePageSkeleton from '@/components/skeleton/HomeSkeleton'
import ShortCutFM from '@/pages/home/shortcutFM'

function ShortCuts() {
  const theme = useTheme()
  const { playlists } = useUserStore()

  const fav = useMemo(() => {
    const favoritelist = playlists.find(
      playlist => playlist.specialType === specialType.fav.type,
    )
    if (favoritelist) {
      return {
        data: {
          picUrl: favoritelist.coverImgUrl,
          title: '你喜欢的音乐',
          id: favoritelist.id,
        },
        type: 'playlist',
        decoration: {
          color: theme.palette.primary.main,
          icon: <Favorite fontSize="small" color={'onPrimary' as 'primary'}/>,
        },
      }
    }
  }, [playlists, theme])
  const [radar, setRadar] = useState({
    data: {
      picUrl: '',
      title: '私人雷达',
    },
    type: 'radar',
    decoration: {
      color: theme.palette.secondary.main,
      icon: (
        <CalendarToday fontSize="small" color={'onSecondary' as 'primary'}/>
      ),
    },
  })

  useEffect(() => {
    // 私人雷达歌单
    getPlaylistDetail(specialType.radar.id).then(({ playlist }) => {
      setRadar((state) => {
        return {
          ...state,
          type: 'playlist',
          data: {
            id: playlist.id,
            picUrl: playlist.coverImgUrl,
            title: '私人雷达',
          },
        }
      })
    })
  }, [])

  const shortcuts = useMemo(() => {
    return [
      fav,
      {
        data: {
          picUrl:
            'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
          title: '每日推荐',
          subTitle: dayjs().format('MM/DD'),
        },
        type: 'daily',
        decoration: {
          color: theme.palette.tertiary.main,
          icon: (
            <RadarIcon fontSize="small" color={'onTertiary' as 'primary'}/>
          ),
        },
      },
      radar,
      {
        data: {
          picUrl:
            'https://cdn.dribbble.com/userupload/5937173/file/original-f14b5cf31374d9e829baab07bbf571a9.jpg?resize=752x',
          title: '音乐云盘',
        },
        type: 'cloud',
        decoration: {
          color: theme.palette.tertiary.main,
          icon: (
            <CloudQueueIcon fontSize="small" color={'onTertiary' as 'primary'}/>
          ),
        },
      },
    ]
  }, [radar, fav])

  return (
    <GridRow rowType={GridType.B}>
      {shortcuts.map((i, idx) => {
        return (
          i && (
            <ShortCut
              key={idx}
              type={i.type as any}
              data={i.data}
              decoration={i.decoration}
            />
          )
        )
      })}
      <ShortCutFM />
    </GridRow>
  )
}

function Home() {
  const { data, isLoading } = useQuery(['home', 'recommend'], async () => {
    const [playlist, radarPlaylist] = await Promise.all([personalizedPlaylist(), personalizedRadar()])
    return {
      playlist,
      radarPlaylist,
    }
  }, {
    staleTime: 30 * 60 * 1000,
  })

  return (
    <PageTransition>
      {
        isLoading ? <HomePageSkeleton /> : <motion.div
          className='flex flex-col gap-4 pr-2'
          initial={{
            opacity: 0, transform: 'translateX(15px)',
          }}
          animate={{
            opacity: 1, transform: 'translateX(0px)',
          }}
          transition={{
            duration: 0.25,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <Col title="晚上好">
            <ShortCuts/>
          </Col>
          <Col title="今日推荐">
            <GridRow singleLine rowType={GridType.A}>
              {data?.playlist?.map(data => (
                <Cover type="playlist" key={data.id} data={data}/>
              ))}
            </GridRow>
          </Col>
          <Col title="雷达歌单">
            <GridRow singleLine rowType={GridType.A}>
              {data?.radarPlaylist?.map(data => (
                <Cover type="playlist" key={data.id} data={data}/>
              ))}
            </GridRow>
          </Col>
        </motion.div>
      }

    </PageTransition>

  )
}

export default Home
