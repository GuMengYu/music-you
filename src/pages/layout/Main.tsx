import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";

export default function Main() {
  return <Box component="main" flex='1'>
    <Outlet />
  </Box>;
}
