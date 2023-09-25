import {
  Box,
  Button,
  Card, Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem, TextField,
  Typography,
} from '@mui/material'
import { ReactNode, useMemo, useState } from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useTheme } from '@mui/material/styles'
import { Close as CloseIcon } from '@mui/icons-material'
import { useWallpapers } from '@/hooks/useWallpapers'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import { GridType } from '@/hooks/useResponsiveGrid'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import SelectMenu from '@/components/SelectMenu'
import { CATGORY, ORDER, PURITY, SORTING, TOPRANGE, useWallpaperStore } from '@/store/wallpaper'
import Switch from '@/components/Switch'

export default function WallpaperPage() {
  const { wallpapers } = useWallpapers()
  const [selectedIndex, setSeletedIndex] = useState(-1)
  const [preview, setPreview] = useState(false)
  const [filter, setFilter] = useState(false)
  const theme = useTheme()
  function FilterButton() {
    return <Button
      color={'tertiaryContainer' as 'primary'}
      variant="contained"
      sx={{
        position: 'fixed',
        top: '50vh',
        right: 12,
        height: 50,
        width: 50,
        borderRadius: 3.5,
        minWidth: 50,
        color: theme.palette.onPrimaryContainer.main,
      }}
      onClick={() => {setFilter(true)}}
    >
      <FilterAltIcon />
    </Button>
  }
  return <PageTransition>
    <Box>
      <GridRow rowType={GridType.B}>
        {
          wallpapers?.map((wallpaper, index) => {
            return <Card
              key={wallpaper.id}
              className="wallpaper-thumb"
              onClick={() => {
                setSeletedIndex(index)
                setPreview(true)
              }}
            >
              <Image fit='cover' src={wallpaper.thumbs.large} className='aspect-video'></Image>
            </Card>
          })
        }

      </GridRow>
      <FilterButton />
      <ImageViewer src={wallpapers[selectedIndex]?.path} open={preview} onClose={() => setPreview(false)} />
      <FilterPanel open={filter} onClose={() => setFilter(false)} />
    </Box>
  </PageTransition>
}

function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme()
  const {
    wallpapers,
    apiKey,
    setApiKey,
    sorting,
    setSorting,
    order,
    setOrder,
    categories,
    setCategories,
    purity,
    setPurity,
    topRange,
    setTopRange,
    page,
    setPage,
    brightness,
    setBrightness,
    blur,
    setBlur,
    useTrackCover,
    setUseTrackCover,
    proxy,
    setProxy,
  } = useWallpaperStore()

  const topRangeOptions = [
    {
      title: '近 1 天',
      value: TOPRANGE.LASTDAY,
      activeClass: 'text-primary',
    },
    {
      title: '近 3 天',
      value: TOPRANGE.LAST_THREE_DAYS,
      activeClass: 'text-primary',
    },
    {
      title: '近 1 周',
      value: TOPRANGE.LAST_WEEK,
      activeClass: 'text-primary',
    },
    {
      title: '近 1 月',
      value: TOPRANGE.LAST_MONTH,
      activeClass: 'text-primary',
    },
    {
      title: '近 3 月',
      value: TOPRANGE.LAST_THREE_MONTH,
      activeClass: 'text-primary',
    },
    {
      title: '近 6 月',
      value: TOPRANGE.LAST_SIX_MONTH,
      activeClass: 'text-primary',
    },
    {
      title: '近 1 年',
      value: TOPRANGE.LAST_YEAR,
      activeClass: 'text-primary',
    },
  ]

  const orderOptions = [
    {
      title: '降序',
      value: ORDER.DESC,
      activeClass: 'text-primary',
    },
    {
      title: '升序',
      value: ORDER.ASC,
      activeClass: 'text-primary',
    },
  ]

  const sortingOptions = [
    {
      title: '相关性',
      value: SORTING.RELEVANCE,
      activeClass: 'text-primary',
    },
    {
      title: '日期',
      value: SORTING.DATE_ADDED,
      activeClass: 'text-primary',
    },
    {
      title: '收藏数',
      value: SORTING.FAVORITES,
      activeClass: 'text-primary',
    },
    {
      title: '热度',
      value: SORTING.HOT,
      activeClass: 'text-primary',
    },
    {
      title: '排行',
      value: SORTING.TOPLIST,
      activeClass: 'text-primary',
    },
    {
      title: '随机',
      value: SORTING.RANDOM,
      activeClass: 'text-primary',
    },
    {
      title: '浏览数',
      value: SORTING.VIEWS,
      activeClass: 'text-primary',
    },
  ]

  const categoriesOptions = [
    {
      title: 'GENERAL',
      value: CATGORY.GENERAL,
      activeClass: 'text-primary',
    },
    {
      title: 'ANIME',
      value: CATGORY.ANIME,
      activeClass: 'text-primary',
    },
    {
      title: 'PEOPLE',
      value: CATGORY.PEOPLE,
      activeClass: 'text-primary',
    },
  ]
  const purityOptions = useMemo(() => {
    const options = [
      {
        title: 'SFW',
        value: PURITY.SFW,
        activeClass: 'text-primary',
      },
      {
        title: 'SKETCHY',
        value: PURITY.SKETCHY,
        activeClass: 'text-primary',
      },
    ]
    if (apiKey) {
      options.push({
        title: 'NSFW',
        value: PURITY.NSFW,
        activeClass: 'text-primary',
      })
    }
    return options
  }, [apiKey])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        'width': 310,
        '& .MuiDrawer-paper': {
          width: 310,
          top: 8,
          bottom: 8,
          right: 8,
          height: 'calc(100% - 16px)',
          borderRadius: 5,
        },
        '& .MuiModal-backdrop': {
          margin: 1,
          borderRadius: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          // backdropFilter: 'blur(100px)',
        },
      }}
    >
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height={40}
          pl={2}
          pr={0.5}
        >
          <Typography variant="caption">wallhaven</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box className='flex flex-col gap-3 p-3'>
          <List
            sx={{ width: '100%', borderRadius: 4, bgcolor: theme.palette.secondaryContainer.main }}
          >
            <Item>
              <Typography variant='caption'>排行</Typography>
              <SelectMenu value={sorting} options={sortingOptions} onChange={(e) => {
                setSorting(e)
              }} />
            </Item>
            <Item>
              <Typography variant='caption'>升降序</Typography>
              <SelectMenu value={order} options={orderOptions} onChange={(e) => {
                setOrder(e)
              }} />
            </Item>
            {
              sorting === SORTING.TOPLIST &&  <Item>
                    <Typography variant='caption'>时间范围</Typography>

                    <SelectMenu value={topRange} options={topRangeOptions} onChange={(e) => {
                      setTopRange(e)
                    }} />
                </Item>
            }

            <Item>
              <Typography variant='caption'>分类</Typography>
              <ChipGroup chips={categoriesOptions} value={categories} onChange={(val) => {
                setCategories(val)
              }}></ChipGroup>
            </Item>
            <Item>
              <Typography variant='caption'>限制级</Typography>
              <ChipGroup chips={purityOptions} value={purity} onChange={(val) => {
                setPurity(val)
              }}></ChipGroup>
            </Item>
          </List>
          <List
            sx={{ width: '100%', borderRadius: 4, bgcolor: theme.palette.secondaryContainer.main }}
          >
            <Item>
              <Typography variant='caption'>apiKey</Typography>
              <TextField
                value={apiKey}
                size="small"
                variant='outlined'
                onChange={(e) => {
                  setApiKey(e.target.value)
                }}
              />
            </Item>
            <Item>
              <Typography variant='caption'>代理</Typography>
              <Switch checked={proxy.open} onChange={(e) => {
                setProxy({ open: e.target.checked, url: proxy.url })
              }}></Switch>
            </Item>
            <Item>
              <Typography variant='caption'>uri</Typography>
              <TextField
                value={proxy.url}
                size="small"
                variant='outlined'
                onChange={(e) => {
                  setProxy({ open: proxy.open, url: e.target.value })
                }}
              />
            </Item>
          </List>
         </Box>
      </Box>
    </Drawer>
  )
}
function Item({ children }: { children: ReactNode }) {
  return <ListItem sx={{ justifyContent: 'space-between' }}>
    {children}
  </ListItem>
}

function ChipGroup({ chips, value, onChange }: {
  chips: { title: string; value: any }[]
  value: any[]
  onChange: (val: any[]) => void
}) {
  function handleClick(val: any) {
    if (value.includes(val))
      onChange(value.filter(v => (v !== val)))

    else
      onChange(value.concat(val))
  }
  function actived(val: any) {
    return value.includes(val)
  }
  return <div className='flex gap-1'>
    {
      chips.map((chip) => {
        return <Chip
          variant={actived(chip.value) ? 'filled' : 'outlined'}
          sx={{
            borderRadius: 1,
          }}
          size='small'
          key={chip.value}
          label={chip.title}
          color={ actived(chip.value) ? 'primary' : 'default' }
          onClick={() => handleClick(chip.value)} />
      })
    }
  </div>
}

