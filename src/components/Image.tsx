import { css, cx } from "@emotion/css";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.4, 0, 0.2, 1];
type Props = {
  fit?: 'cover' | 'contain' | 'fill' | 'none'
  src?: string;
  srcSet?: string;
  sizes?: string;
  className?: string;
  lazyLoad?: boolean;
  placeholder?: "artist" | "album" | "playlist" | "podcast" | "blank" | false;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLImageElement>) => void;
  animation?: boolean;
  gradient?: string
};

const Image = ({
  fit,
  src,
  srcSet,
  className,
  lazyLoad = true,
  sizes,
  placeholder = "blank",
  onClick,
  onMouseOver,
  animation = true,
  gradient,
}: Props) => {
  const [error, setError] = useState(false);
  const animate = useAnimation();
  const placeholderAnimate = useAnimation();
  const isAnimate = animation;
  useEffect(() => setError(false), [src]);

  const onLoad = async () => {
    if (isAnimate) {
      animate.start({ opacity: 1 });
      placeholderAnimate.start({ opacity: 0 });
    }
  };
  const onError = () => {
    setError(true);
  };

  const transition = { duration: 0.6, ease };
  const motionProps = isAnimate
    ? {
        animate,
        initial: { opacity: 0 },
        exit: { opacity: 0 },
        transition,
      }
    : {};
  const placeholderMotionProps = isAnimate
    ? {
        animate: placeholderAnimate,
        initial: { opacity: 1 },
        exit: { opacity: 0 },
        transition,
      }
    : {};

  return (
    <div
      onClick={onClick}
      onMouseOver={onMouseOver}
      className={cx(
        "overflow-hidden",
        'h-full',
        'w-full',
        'relative',
        className,
      )}
    >
      {/* Image */}
      <AnimatePresence>
        <motion.img
          // className='absolute inset-0 h-full w-full'
          style={{
            height: "100%",
            width: "100%",
            objectFit: fit
          }}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          decoding="async"
          loading={lazyLoad ? "lazy" : undefined}
          onError={onError}
          onLoad={onLoad}
          {...motionProps}
        />
      </AnimatePresence>

      {/* Placeholder / Error fallback */}
      <AnimatePresence>
        {placeholder && (
          <motion.div
            {...placeholderMotionProps}
            className="absolute inset-0 h-full w-full bg-white dark:bg-white/10"
          ></motion.div>
        )}
      </AnimatePresence>
      {
        gradient && (
          <div className="absolute inset-0 h-full w-full" style={{
            backgroundImage: gradient
          }}></div>
        )
      }
    </div>
  );
};

export default Image;
