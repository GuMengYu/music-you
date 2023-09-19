import {getPlaylistDetail} from "@/api/playlist";
import Image from "@/components/Image";
import {Playlist} from "@/types";
import {formatDuring, formatNumber} from "@/util/fn";
import {Divider, Typography, useTheme} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import dayjs from "dayjs";
import {useLoaderData, useParams} from "react-router-dom";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PageTransition from "@/components/PageTransition";


const PlayListHeader = ({playlist}: { playlist: Playlist | undefined }) => {
  const theme = useTheme();
  const tracksDt = playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0);

  function formatDate(
    date: number | string | undefined,
    format = "YYYY-MM-DD"
  ) {
    return dayjs(date).format(format);
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="drag-area flex justify-between -ml-2 -mr-4 h-80 relative">
          <Image
            className="absolute"
            src={playlist?.coverImgUrl}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className="mb-auto"></div>
            <div className="no-drag-area flex flex-col mx-6 mb-4 gap-2">
              <Typography variant="h4">{playlist?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1">
                  {playlist?.["creator"]?.nickname}
                </Typography>
                <Typography variant="caption">
                  {formatDate(playlist?.createTime)}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{minWidth: "96px"}}
                >
                  <Typography variant="body1">
                    {playlist?.["trackCount"]}
                  </Typography>
                  <Typography variant="caption">首</Typography>
                </div>
                <Divider className="my-2" orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{minWidth: "96px"}}
                >
                  <QueueMusicIcon/>
                  <Typography variant="caption">歌单</Typography>
                </div>
                <Divider className="my-2" orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{minWidth: "96px"}}
                >
                  <Typography variant="body1">
                    {formatDuring(tracksDt)}
                  </Typography>
                  <Typography variant="caption">时长</Typography>
                </div>
                <Divider className="my-2" orientation="vertical"/>

                <div
                  className="flex flex-col items-center pl-4"
                  style={{minWidth: "96px"}}
                >
                  <Typography variant="body1">
                    {playlist?.playCount ? formatNumber(playlist?.["playCount"]) : 0}
                  </Typography>
                  <Typography variant="caption">次</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>

  );
};
export default function PlaylistPage() {
  const params = useParams();
  // const playlist = useLoaderData() as Playlist
  const {data: playlist} = useQuery(
    ["playlist", "detail"],
    () => {
      return getPlaylistDetail(+params.id!);
    },
    {
      enabled: !!params.id,
    }
  );
  return (
    <div>
      <PlayListHeader playlist={playlist?.playlist}/>
    </div>
  );
}
