import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import Lottie from "lottie-web";

export default function LottieIcon({
  option,
  width,
  height,
  animUpdated,
  animCreated,
}: {
  option: Record<any, any>;
  width?: number;
  height?: number;
  animUpdated?: (ani: AnimationItem) => void;
  animCreated?: (ani: AnimationItem) => void;
}) {
  const iconRef = useRef<HTMLDivElement>(null);
  let animation: AnimationItem | null = null;

  useEffect(() => {
    loadAnimation();
  }, []);
  function loadAnimation(updated = false) {
    if (iconRef.current) {
      animation = Lottie.loadAnimation({
        container: iconRef.current,
        renderer: "svg",
        loop: option.loop !== false,
        autoplay: option.autoplay !== false,
        animationData: option.animationData,
        rendererSettings: option.rendererSettings,
      });
      if (animation) {
        animation.setSpeed(2);
        if (updated) {
          animUpdated?.(animation);
        } else {
          animCreated?.(animation);
        }
      }
    }
  }
  function update() {
    animation?.destroy();
    loadAnimation(true);
  }
  return (
    <div
      ref={iconRef}
      style={{
        height: height ? `${height}px` : "100%",
        width: width ? `${width}px` : "100%",
        overflow: "hidden",
        margin: "0 auto",
      }}
    ></div>
  );
}
