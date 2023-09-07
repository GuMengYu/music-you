import { useAppStore } from "@/store/app";
import { IconButton } from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'

export default function MenuToggle() {
  const { rail, toggleRail } = useAppStore();
  return <IconButton color="primary" className="no-drag-area" onClick={toggleRail} sx={{
    height: 56,
    width: 56,
  }}>
    {
      rail ? <MenuOpenIcon sx={{height: 20, width: 20}} /> : <MenuIcon sx={{height: 20, width: 20}} />
    }
  </IconButton>;
}
