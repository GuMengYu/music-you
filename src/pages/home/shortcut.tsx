import Image from "@/components/Image";
import { Box, Card, IconButton, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { PlayArrow as PlayIcon } from "@mui/icons-material";

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
  const theme = useTheme();
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
              <IconButton
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.onPrimary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primaryContainer.main,
                    color: theme.palette.onPrimaryContainer.main,
                  },
                }}
              >
                <PlayIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Card>
  );
}
