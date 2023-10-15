import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import SearchBar from '@/pages/layout/SearchBar'
import Account from '@/components/button/Account'
import { useAppStore } from '@/store/app'

export default function Header() {
  const theme = useTheme()
  const { showSearch } = useAppStore()
  return <Box
    className='flex gap-2 items-center'
    sx={{
      height: 56,
      zIndex: 2,
      gridArea: 'main',
      pr: 1,
      position: 'relative',
    }}
  >
    <div className='flex flex-1'>
      {
        showSearch && <SearchBar />
      }
      <div className='flex-auto'></div>
      <Account />
    </div>
    <Box sx={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: 'background-color .25s',
      // bgcolor: theme.palette.secondaryContainer.main,
      zIndex: -1,
    }}></Box>

    {/*<Account />*/}
  </Box>
}
