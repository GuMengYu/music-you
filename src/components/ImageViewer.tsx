import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, IconButton, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import Image from '@/components/Image'

function ImageViewer({ src, open, onClose }: {
  src: string
  open: boolean
  onClose?: () => void
}) {
  const theme = useTheme()
  const [isHovering, setIsHovering] = useState(false)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape')
      onClose && onClose()
  }
  const removeListener = () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
  useEffect(() => {
    if (open)
      window.addEventListener('keydown', handleKeyDown)
    else
      removeListener()

    return () => {
      removeListener()
    }
  }, [open])
  return createPortal(<React.Fragment>
    <AnimatePresence>
      {open && (
        <motion.div
          style={{
            background: `${theme.palette.surface.main}cc`,
          }}
          className='fixed inset-0 z-10  backdrop-blur-2xl rounded-xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ ease: [0.34, 1.56, 0.64, 1] }}
        ></motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {
        open && <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ ease: [0.34, 1.56, 0.64, 1] }}
          className='fixed inset-0 z-10 flex flex-col items-center justify-center'
        >
          <Box onMouseEnter={() => setIsHovering(true)}
               onMouseLeave={() => setIsHovering(false)}
               boxShadow={1} sx={{
                 overflow: 'hidden',
                 borderRadius: 6,
                 height: '70vh',
                 mb: 2,
                 position: 'relative',

               }}>
            <Image src={src} className='absolute' />
          </Box>
          <IconButton sx={{
            bgcolor: `${theme.palette.primary.main}36`,
          }} size='large' onClick={onClose}><CloseIcon /></IconButton>
        </motion.div>
      }
    </AnimatePresence>
  </React.Fragment>, document.body)
}
export default ImageViewer
