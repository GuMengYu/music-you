import Migration from "@/components/migration";
import { PlayerContext } from "@/contexts/player";
import { usePlayerStore } from "@/store/player";
import { Box, Button } from "@mui/material";
import { useContext } from "react";

function Library() {
  console.log('library-----')
  const player = useContext(PlayerContext)
  const {currentTime, setCurrentTime} = usePlayerStore()
  function playerTest() {
  }
  return <Box>
    <Migration />
    <Button onClick={() => {
      setCurrentTime(currentTime + 1)
    }}>{ currentTime }</Button>
    <Button onClick={() => {
      playerTest()
    }}>player test</Button>
  </Box>;
}

export default Library;
