import {Box, IconButtonProps, CircularProgress, IconButton} from "@mui/material";
import {memo, PropsWithChildren} from "react";

function LoadingButton(props: IconButtonProps & PropsWithChildren & { loading: boolean }) {
  // @ts-ignore
  return <IconButton
    {...props}
    loading={undefined}
  >
    <Box sx={{
      height: 40,
      width: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {
        props.loading ? <CircularProgress
          size={20}
          color="secondary"
        ></CircularProgress> : props.children
      }

    </Box>

  </IconButton>
}

export default memo(LoadingButton)
