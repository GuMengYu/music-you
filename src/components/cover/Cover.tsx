import {sizeOfImage, toHttps} from "@/util/fn";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {PlayArrow as PlayIcon, Pause as PauseIcon} from "@mui/icons-material";
import Image from "@/components/Image";
import {getTrackList} from "@/api/music";
import {playQueueStore} from "@/store/playQueue";
import {usePlayer} from "@/hooks/usePlayer";
import { useNavigate } from "react-router-dom";

const Cover = ({data, subTitle, type}: { data: any; subTitle?: string; type: 'album' | 'playlist' }) => {
  const theme = useTheme();
  const coverBgUrl = sizeOfImage(toHttps(data.picUrl ?? data.coverImgUrl));
  const _subTitle = subTitle ?? data.copywriter;
  const [isHovering, setIsHovering] = useState(false);
  const {updatePlayQueue} = playQueueStore()
  const {player} = usePlayer()
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()
  function jumpTo() {
    navigate(`/playlist/${data.id}`,)
  }

  async function handlePlay() {
    try {
      const info = await getTrackList(type, data.id)
      updatePlayQueue(info.id, type, data.name, info.tracks)
      player.next()
      setLoaded(true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        borderRadius: 4,
        bgcolor: theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={jumpTo}
    >
      <Box>
        <Box
          sx={{
            position: "relative",
            aspectRatio: 1 / 1
          }}
        >
          {/* <CardMedia
            component="img"
            image={coverBgUrl}
            sx={{ aspectRatio: 1 / 1, borderRadius: 4 }}
          ></CardMedia> */}
          <Image src={coverBgUrl} className="absolute"/>

          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{
                  opacity: 0,
                  position: "absolute",
                  bottom: 0,
                  padding: 8,
                  transform: "translateY(20px)",
                }}
                animate={{
                  opacity: 1,
                  transform: "translateY(0px)",
                }}
                exit={{
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.onPrimary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primaryContainer.main,
                      color: theme.palette.onPrimaryContainer.main,
                    }
                  }}
                  onClick={handlePlay}
                >
                  <PlayIcon sx={{fontSize: 36}}/>
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <CardContent sx={{px: 1.5}}>
          <Typography className="line-clamp-1" variant="subtitle2">
            {data.name}
          </Typography>
          <Typography className="line-clamp-1" variant="body2">
            {_subTitle}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export {Cover};
