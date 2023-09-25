import { useQuery } from '@tanstack/react-query'
import { entries, groupBy, random } from 'lodash-es'
import { Typography } from '@mui/material'
import PageTransition from '@/components/PageTransition'
import { getCatList } from '@/api/playlist'
import { HexColors } from '@/util/metadata'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import MdTag from '@/components/Tag'

const randomColor = () => HexColors[random(0, HexColors.length)]
export default function MoodsGenresPage() {
  const { data, isLoading } = useQuery([], async () => {
    const { sub, categories } = await getCatList()
    const items = sub.map((i: any) => {
      i.color = randomColor()
      return i
    })
    const group = groupBy(items, 'category') ?? {}
    let cats = []
    cats = entries(group).map(([k, v]) => ({
      title: categories[k],
      tags: v,
    }))
    cats.unshift({
      title: '推荐',
      tags: [
        {
          color: randomColor(),
          name: '官方',
        },
        {
          color: randomColor(),
          name: '精品',
        },
        {
          color: randomColor(),
          name: '推荐',
        },
      ],
    })
    return {
      cats,
    }
  }, {
    staleTime: 30 * 60 * 60 * 1000,
  })
  return <PageTransition>
    <Typography variant='h6'>歌单广场</Typography>
    {
      data?.cats?.map((cat) => {
        return <Col variant='body1' title={cat.title} key={cat.title}>
          <GridRow>
            {
              cat.tags.map((tag) => {
                return <MdTag key={tag.name} name={tag.name} tagcolor={tag.color} to={`${tag.name}`} />
              })
            }
          </GridRow>
        </Col>
      })
    }
  </PageTransition>
}
