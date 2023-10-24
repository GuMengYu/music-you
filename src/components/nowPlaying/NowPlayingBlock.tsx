import { motion } from 'framer-motion'
import NowPlayingMiniBar from '@/components/nowPlaying/NowPlayingMiniBar'

export default function NowPlayingBlock() {
  return <motion.div className='cursor-grab'
                     drag
                     dragMomentum={false}
                     whileDrag={{ scale: 1.02 }}
  >
    <NowPlayingMiniBar />
    </motion.div>
}
