import Migration from "@/components/migration";
import { PlayerContext } from "@/contexts/player";
import { useAppStore } from "@/store/app";
import { Box, Button } from "@mui/material";
import { useContext, useRef, Fragment, useEffect, useState } from "react";
import { GridType, useResponsiveGrid } from "@/hooks/useResponsiveGrid";
import { useElementScrollSize } from "@/hooks/useElementScrollSize";
import GridRow from "@/components/GridRow";
import { Cover } from "@/components/cover/Cover";
import {
  QueryKeys,
  personalizedPlaylist,
  personalizedRadar,
} from "@/api/personalized";
import { Playlist } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Col from "@/components/Col";
import ShortCut from "./home/shortcut";
import { CalendarToday } from "@mui/icons-material";
import { useTheme } from "@mui/material";

function Home() {
  const theme = useTheme();
  const { data: playlist } = useQuery([QueryKeys.personalizedPlaylist], () => {
    return personalizedPlaylist();
  });
  const { data: radarPlaylist } = useQuery(
    [QueryKeys.personalizedRadar],
    () => {
      return personalizedRadar();
    }
  );
  // const [playlist, setPlayList] = useState<Playlist[]>([]);

  // useEffect(() => {
  //   personalizedPlaylist().then((res) => {
  //     setPlayList(res);
  //   });
  // }, []);
  const shortcuts = [
    {
      data: {
        picUrl:
          "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp",
        title: "this is title",
      },
      type: "daily",
      decoration: {
        color: theme.palette.primary.main,
        icon: (
          <CalendarToday
            fontSize="small"
            color={'onPrimary' as "primary"}
          />
        ),
      },
    },
    {
      data: {
        picUrl:
          "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp",
        title: "this is title",
        subTitle: 'this is subtitle',
      },
      type: "daily",
      decoration: {
        color: theme.palette.primary.main,
        icon: (
          <CalendarToday
            fontSize="small"
            color={'onPrimary' as "primary"}
          />
        ),
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Col title="晚上好">
        <GridRow rowType={GridType.B}>
          {shortcuts.map((i, idx) => {
            return <ShortCut key={idx} type={i.type as any} data={i.data} decoration={i.decoration} />;
          })}
        </GridRow>
      </Col>
      <Col title="今日推荐">
        <GridRow singleLine rowType={GridType.A}>
          {playlist?.map((data) => (
            <Cover type='playlist' key={data.id} data={data} />
          ))}
        </GridRow>
      </Col>
      <Col title="雷达歌单">
        <GridRow singleLine rowType={GridType.A}>
          {radarPlaylist?.map((data) => (
            <Cover type='playlist' key={data.id} data={data} />
          ))}
        </GridRow>
      </Col>
    </div>
  );
}

export default Home;
