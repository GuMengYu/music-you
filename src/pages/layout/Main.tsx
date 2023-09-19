import {useAppStore} from "@/store/app";
import {useTheme} from "@mui/material";
import {styled} from "@mui/material";
import {Box} from "@mui/system";
import {Outlet} from "react-router-dom";
import useInForeground from "@/hooks/useInForeground";
import {AnimatePresence} from "framer-motion";

export default function Main() {
  const {rail} = useAppStore();
  const theme = useTheme();
  const {isActive: inDetail} = useInForeground(['playlist', 'album'])

  // const AppMain = styled(Box)(() => ({
  //   overflowY: "auto",
  //   marginTop: 16,
  //   marginBottom: 16,
  //   paddingLeft: 16,
  //   paddingRight: 16,
  //   // transition: theme.transitions.create("width", {
  //   //   easing: theme.transitions.easing.easeIn,
  //   //   duration: theme.transitions.duration.complex,
  //   // }),
  //   width: `calc(100vw - ${rail ? "256px" : "72px"} - 16px)`,
  // }));
  return (
    <Box
      sx={{
        overflowY: "auto",
        marginTop: inDetail ? 0 : 2,
        marginBottom: 2,
        paddingLeft: 1,
        paddingRight: 2,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.easeIn,
          duration: theme.transitions.duration.complex,
        }),
        width: `calc(100vw - ${rail ? "256px" : "72px"} - 16px)`,
      }}
      component="main"
      className="hide-scrollbar"
    >
      <AnimatePresence mode='wait'>
        <Outlet/>
      </AnimatePresence>
    </Box>
  );
}
