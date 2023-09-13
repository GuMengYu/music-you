import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Card, Button } from "@mui/material";
import { useMemo } from "react";
import Md3Dialog from "./Md3Dialog";
import {
  Close,
  EditRounded,
  Logout as LogoutIcon,
  AddCircleOutline as PlusIcon,
  GitHub as GithubIcon,
  Assessment as AssignmentIcon,
} from "@mui/icons-material";
import { ipcRenderer } from "electron";
import is from "@/util/is";
const Profile = () => {
  const { showProfile: open, toggleProfile } = useAppStore();
  const { account } = useUserStore();
  const theme = useTheme();
  const avatarUrl = useMemo(() => {
    return account?.profile.avatarUrl;
  }, [account]);

  const BottomButton = styled(Button)(() => ({
    flex: 1,
    height: 60,
    boxShadow: "none",
    border: "1px solid transparent",
    justifyContent: "start",
    gap: 4,
    "&:hover": {
      bgcolor: theme.palette.secondaryContainer.main,
      borderColor: theme.palette.primary.main,
    },
  }));
  BottomButton.defaultProps = {
    variant: "contained",
    color: "surface" as "primary",
    disableElevation: true,
  };
  const goto = (url: string) => {
    if (is.electron()) {
      ipcRenderer.invoke("open-url", url);
    } else {
      window.open(url, "_blank");
    }
  };
  function handleClose() {
    toggleProfile(false)
  }
  return (
    <Md3Dialog open={open} onClose={handleClose}>
      <Card
        sx={{
          width: 400,
          padding: 2,
          bgcolor: theme.palette.surfaceVariant.main,
          color: theme.palette.onSurfaceVariant.main,
        }}
      >
        <Box display="flex" justifyContent="end" mb={1}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: 86,
              bgcolor: theme.palette.surface.main,
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              borderRadius: 4,
              px: 2,
            }}
          >
            <Avatar
              sx={{
                height: 56,
                width: 56,
                mr: 2,
              }}
              src={avatarUrl}
            ></Avatar>
            <Box>
              <Typography variant="h6">{account?.profile.nickname}</Typography>
              <Typography variant="caption" className="line-clamp-1">
                {account?.profile.signature}
              </Typography>
            </Box>
          </Card>
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: 48,
              width: 48,
              borderRadius: 3.5,
              minWidth: 48,
              position: "absolute",
              bottom: -30,
              right: 25,
            }}
          >
            <EditRounded />
          </Button>
        </Box>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "space-between",
            gap: 0.5,
          }}
        >
          <BottomButton
            sx={{
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
            }}
          >
            <PlusIcon /> 添加账号
          </BottomButton>
          <BottomButton
            sx={{
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
            }}
          >
            <LogoutIcon />
            退出账号
          </BottomButton>
        </Box>
        <Box display="flex" justifyContent="center" mt={2} gap={1}>
          <Button
            variant="text"
            size="small"
            onClick={() => goto("https://github.com/GuMengYu/music-you/blob/dev/README.md#声明")}
          >
            <Typography variant="caption">免责声明 </Typography>
          </Button>
          <Typography variant="h6">·</Typography>
          <Button
            size="small"
            variant="text"
            onClick={() => goto("https://github.com/GuMengYu/music-you")}
          >
            <Typography variant="caption">github </Typography>
          </Button>
        </Box>
      </Card>
    </Md3Dialog>
  );
};

export default Profile;
