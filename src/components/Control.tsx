import { Box, IconButton } from "@mui/material";
import PlayToggle from "./toggle/PlayToggle";
import {
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
} from "@mui/icons-material";
import { usePlayerControl } from "@/hooks/usePlayer";

const Control = () => {
  const { playNext, playPrev } = usePlayerControl()
  return (
    <div className="flex gap-3 items-center">
      <IconButton onClick={playPrev}>
        <SkipPreviousIcon fontSize='small' />
      </IconButton>
      <PlayToggle />
      <IconButton onClick={playNext}>
        <SkipNextIcon  fontSize='small' />
      </IconButton>
    </div>
  );
};


export {
  Control,
}