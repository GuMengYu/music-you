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
import {PlayIcon} from '@/components/icons/icons'
import Image from "@/components/Image";
import {getTrackList} from "@/api/music";
import {playQueueStore} from "@/store/playQueue";
import {usePlayer} from "@/hooks/usePlayer";
import {useNavigate} from "react-router-dom";
import {Artist} from "@/types";
import {cx} from "@emotion/css";

const ArtistCover = ({data, compact}: { data: Artist; compact?: boolean }) => {
  const theme = useTheme();
  const coverBgUrl = sizeOfImage(toHttps(data.picUrl ?? data.picUrl));
  const [isHovering, setIsHovering] = useState(false);
  const {updatePlayQueue} = playQueueStore()
  const {player} = usePlayer()
  const navigate = useNavigate()

  function jumpTo() {
    navigate(`/artist/${data.id}`,)
  }

  async function handlePlay(e: any) {
    e.stopPropagation()
    try {
      const info = await getTrackList('artist', data.id)
      updatePlayQueue(info.id, 'artist', data.name, info.tracks)
      player.next()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        borderRadius: compact ? '50%' : 4,
        bgcolor: compact ? 'transparent' : theme.palette.surfaceVariant.main,
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
            aspectRatio: 1
          }}
        >
          <Box className={cx('absolute', !compact && 'p-4')}>
            <Image src={coverBgUrl} className="absolute rounded-full"/>
          </Box>
          <AnimatePresence>
            {isHovering && (
              <motion.div
                className='absolute flex items-center justify-center h-full w-full'
                initial={{
                  opacity: 0,
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
                  onClick={handlePlay}
                >
                  <PlayIcon  sx={{fontSize: '4rem'}} color='primary' />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        {
          !compact && (
            <CardContent sx={{px: 1.5}}>
              <Typography className="line-clamp-1 text-center" variant="subtitle2">
                {data.name}
              </Typography>
            </CardContent>
          )
        }

      </Box>
    </Card>
  );
};

export default ArtistCover;
