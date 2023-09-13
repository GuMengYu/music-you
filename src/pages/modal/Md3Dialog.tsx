import type { ReactNode, ReactPropTypes } from "react";
import { styled, Dialog, DialogProps} from '@mui/material'
 

export default function Md3Dialog(props: DialogProps) {
  const MdDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 24,
    },
  }));

  return <MdDialog {...props}>
    {props.children}
  </MdDialog>
}