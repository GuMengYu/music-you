import type { AnimationItem } from "lottie-web";

import { useUserStore } from "@/store/user";
import { sleep } from "@/util/fn";
import heart from "@/assets/lottie-assets/heart.json";
import { Button, IconButton } from "@mui/material";
import LottieIcon from "../LottieIcon";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useMemo, useState } from "react";
export default function ({
  id,
  size,
  color,
}: {
  id?: number;
  size?: "small" | "medium" | "large";
  color?: string;
}) {
  const { likes, favSong } = useUserStore();
  const heartOptions = {
    animationData: heart,
    loop: false,
    autoplay: true,
  };
  const [heartAnim, setHeartAnim] = useState<AnimationItem | null>(null);
  const [showAnim, setShowAnim] = useState(false);

  const liked = useMemo(() => {
    return likes.includes(id!);
  }, [likes]);

  function handleAnimation(animation: AnimationItem) {
    console.log("---- created animation ", animation);

    setHeartAnim(animation);
  }
  async function likeSong() {
    const _liked = liked;
    const success = await favSong(id!, !_liked);
    if (!_liked && success) {
      setShowAnim(true);
      heartAnim?.goToAndPlay(0, true);
      await sleep(1000);
      setShowAnim(false);
    }
  }
  return (
    <IconButton
      onClick={likeSong}
      sx={{ p: 0, height: 51, width: 51 }}
      color="error"
    >
      {showAnim ? (
        <LottieIcon
          option={heartOptions}
          height={size === "small" ? 31 : 51}
          width={size === "small" ? 31 : 51}
          animCreated={handleAnimation}
        ></LottieIcon>
      ) : liked ? (
        <FavoriteIcon />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  );
}
