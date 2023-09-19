import Migration from "@/components/migration";
import {PlayerContext} from "@/contexts/player";
import {useAppStore} from "@/store/app";
import {Box, Button} from "@mui/material";
import {
  useContext,
  useRef,
  Fragment,
  useEffect,
  useState,
  useMemo,
} from "react";
import {GridType, useResponsiveGrid} from "@/hooks/useResponsiveGrid";
import {useElementScrollSize} from "@/hooks/useElementScrollSize";
import GridRow from "@/components/GridRow";
import {Cover} from "@/components/cover/Cover";
import {
  QueryKeys,
  personalizedPlaylist,
  personalizedRadar,
} from "@/api/personalized";
import {Playlist} from "@/types";
import {useQuery} from "@tanstack/react-query";
import Col from "@/components/Col";
import ShortCut from "./home/shortcut";
import {
  CalendarToday,
  Favorite,
  Radar as RadarIcon,
} from "@mui/icons-material";
import {useTheme} from "@mui/material";
import dayjs from "dayjs";
import {specialType} from "@/util/metadata";
import {getPlaylistDetail} from "@/api/playlist";
import {useUserStore} from "@/store/user";
import PageTransition from "@/components/PageTransition";

const ShortCuts = () => {
  const theme = useTheme();
  const {playlists} = useUserStore();

  const fav = useMemo(() => {
    const favoritelist = playlists.find(
      (playlist) => playlist.specialType === specialType.fav.type
    );
    if (favoritelist) {
      return {
        data: {
          picUrl: favoritelist.coverImgUrl,
          title: "你喜欢的音乐",
          id: favoritelist.id
        },
        type: "playlist",
        decoration: {
          color: theme.palette.primary.main,
          icon: <Favorite fontSize="small" color={"onPrimary" as "primary"}/>,
        },
      };
    }
  }, [playlists, theme]);
  const [radar, setRadar] = useState({
    data: {
      picUrl: "",
      title: "私人雷达",
    },
    type: "radar",
    decoration: {
      color: theme.palette.secondary.main,
      icon: (
        <CalendarToday fontSize="small" color={"onSecondary" as "primary"}/>
      ),
    },
  });

  useEffect(() => {
    // 私人雷达歌单
    getPlaylistDetail(specialType.radar.id).then(({playlist}) => {
      setRadar((state) => {
        return {
          ...state,
          data: {
            id: playlist.id,
            picUrl: playlist.coverImgUrl,
            title: "私人雷达",
          },
        };
      });
    });
  }, []);

  const shortcuts = useMemo(() => {
    return [
      fav,
      {
        data: {
          picUrl:
            "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp",
          title: "每日推荐",
          subTitle: dayjs().format("MM/DD"),
        },
        type: "daily",
        decoration: {
          color: theme.palette.tertiary.main,
          icon: (
            <RadarIcon fontSize="small" color={"onTertiary" as "primary"}/>
          ),
        },
      },
      radar,
    ];
  }, [radar, fav]);

  return (
    <GridRow rowType={GridType.B}>
      {shortcuts.map((i, idx) => {
        return (
          i && (
            <ShortCut
              key={idx}
              type={i.type as any}
              data={i.data}
              decoration={i.decoration}
            />
          )
        );
      })}
    </GridRow>
  );
};

function Home() {
  const {data: playlist} = useQuery([QueryKeys.personalizedPlaylist], () => {
    return personalizedPlaylist();
  });
  const {data: radarPlaylist} = useQuery(
    [QueryKeys.personalizedRadar],
    () => {
      return personalizedRadar();
    }
  );

  return (
    <PageTransition>
      <div className="flex flex-col gap-4">
        <Col title="晚上好">
          <ShortCuts/>
        </Col>
        <Col title="今日推荐">
          <GridRow singleLine rowType={GridType.A}>
            {playlist?.map((data) => (
              <Cover type="playlist" key={data.id} data={data}/>
            ))}
          </GridRow>
        </Col>
        <Col title="雷达歌单">
          <GridRow singleLine rowType={GridType.A}>
            {radarPlaylist?.map((data) => (
              <Cover type="playlist" key={data.id} data={data}/>
            ))}
          </GridRow>
        </Col>
      </div>
    </PageTransition>

  );
}

export default Home;
