import { InputBase, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const theme = useTheme()
  const navigate = useNavigate()
  function handleSearch(e: any) {
    const { code, target } = e
    if (code === 'Enter' && !!target.value)
      navigate(`/search?keyword=${target.value}`)

  }
  return  <Paper
    sx={{ display: 'flex', alignItems: 'center', bgcolor: theme.palette.surfaceVariant.main, borderRadius: 16, width: 280, p: '2px' }}
  >
    <InputBase
      sx={{ ml: 3, flex: 1 }}
      placeholder="Search Anything"
      inputProps={{ 'aria-label': 'search anything' }}
      onKeyDown={handleSearch}
    />
  </Paper>
}
