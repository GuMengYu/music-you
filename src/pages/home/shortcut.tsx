import Image from "@/components/Image";
import { Box, Card, IconButton, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Track } from "@/types";
import { getDailyRecommend, recent } from "@/api/user";
import { playQueueStore } from "@/store/playQueue";
import { getTrackList } from "@/api/music";
import { usePlayerControl } from "@/hooks/usePlayer";
import LoadingButton from "@/components/button/LoadingButton";
import {PlayIcon} from "@/components/icons/icons";
export default function ShortCut({
  data,
  decoration,
  type,
}: {
  data: any;
  decoration: {
    text?: string;
    icon?: ReactNode;
    color?: string;
  };
  type: "album" | "playlist" | "artist" | "daily" | "recent" | "program";
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePlayQueue } = playQueueStore();
  const { playNext } = usePlayerControl();
  const theme = useTheme();
  async function handlePlay() {
    try {
      setLoading(true);
      let info: {
        id?: number;
        list: Track[];
      };
      if (type === "daily") {
        const { data } = await getDailyRecommend();
        info = {
          list: data["dailySongs"],
        };
        updatePlayQueue(0, "daily", "日推", info.list);
      } else if (type === "recent") {
        const { data } = await recent();
        info = {
          list: data.list.map((i) => i["data"]),
        };
        updatePlayQueue(0, "recent", "最近播放", info.list);
      } else {
        const _data = await getTrackList(type, data.id as number);
        info = {
          id: _data.id,
          list: _data.tracks,
        };
        updatePlayQueue(info.id!, type, data.name!, info.list);
      }
      playNext();
    } catch (e) {
      console.debug(e);
    } finally {
      setLoading(false);
    }
  }
  function handleJump() {}
  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        height: 76,
        borderRadius: 4,
        bgcolor: theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleJump}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100%",
          height: 45,
          width: 45,
          bgcolor: decoration.color,
          ml: 2,
        }}
      >
        {decoration.icon}
        {decoration.text && <span>{decoration.text}</span>}
      </Box>
      <div className="flex flex-col items-start justify-between px-4 flex-1">
        <Typography
          title={data.title}
          className="line-clamp-1"
          variant="subtitle1"
        >
          {data.title}
        </Typography>
        <Typography
          title={data.subTitle}
          className="line-clamp-1"
          variant="caption"
        >
          {data.subTitle}
        </Typography>
      </div>
      <Box
        sx={{
          height: 76,
          width: 76,
          position: "relative",
        }}
      >
        <Image sizes="" src={data.picUrl} className="absolute" />
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="flex justify-center items-center top-0 w-full h-full absolute"
              initial={{
                opacity: 0,
                transform: "translateX(30px)",
              }}
              animate={{
                opacity: 1,
                transform: "translateX(0px)",
              }}
              exit={{
                opacity: 0,
                transform: "translateX(30px)",
              }}
              transition={{
                duration: 0.35,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <LoadingButton
                loading={loading}
                onClick={handlePlay}
                sx={{
                  p: 0,
                  bgcolor: `${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}F2`,
                  }
                }}
              >
                <PlayIcon sx={{fontSize: '2.5rem'}} color={'onPrimary' as 'primary'} />
              </LoadingButton>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Card>
  );
}
