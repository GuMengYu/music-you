import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export default function NavigateButton() {
  return <div className='flex items-center'>
    <IconButton>
      <ChevronLeftIcon/>
    </IconButton>
    <IconButton>
      <ChevronRightIcon/>
    </IconButton>
  </div>
}
