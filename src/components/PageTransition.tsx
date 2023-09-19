import {motion} from 'framer-motion'
import {ReactNode} from "react";

const PageTransition = ({children, disableEnterAnimation,}: {
  children: ReactNode
  disableEnterAnimation?: boolean
}) => {
  // To restore scroll position
  // useLayoutEffect(() => {
  //   const main = document.querySelector('main')
  //   if (main) {
  //     main.scrollTop = scrollPositions.get(window.location.pathname) ?? 0
  //   }
  // }, [])

  return (
    <motion.div
      initial={{
        opacity: disableEnterAnimation ? 1 : 0,
        transform: disableEnterAnimation ? "translateX(0px)" : "translateX(20px)",
      }}
      animate={{opacity: 1, transform: "translateX(0px)",}}
      exit={{opacity: 0, transform: "translateX(-20px)" }}
      transition={{duration: 0.3, ease: [0.34, 1.56, 0.64, 1]}}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
