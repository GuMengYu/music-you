const { cookieToJson } = require('NeteaseCloudMusicApi/util/index')
const decode = require('safe-decode-uri-component')

const request = require('NeteaseCloudMusicApi/util/request')

const activate_init_profile = require('NeteaseCloudMusicApi/module/activate_init_profile')
const album = require('NeteaseCloudMusicApi/module/album')
const album_detail = require('NeteaseCloudMusicApi/module/album_detail')
const album_detail_dynamic = require('NeteaseCloudMusicApi/module/album_detail_dynamic')
const album_list = require('NeteaseCloudMusicApi/module/album_list')
const album_list_style = require('NeteaseCloudMusicApi/module/album_list_style')
const album_new = require('NeteaseCloudMusicApi/module/album_new')
const album_newest = require('NeteaseCloudMusicApi/module/album_newest')
const album_songsaleboard = require('NeteaseCloudMusicApi/module/album_songsaleboard')
const album_sub = require('NeteaseCloudMusicApi/module/album_sub')
const album_sublist = require('NeteaseCloudMusicApi/module/album_sublist')
const artist_album = require('NeteaseCloudMusicApi/module/artist_album')
const artist_desc = require('NeteaseCloudMusicApi/module/artist_desc')
const artist_detail = require('NeteaseCloudMusicApi/module/artist_detail')
const artist_list = require('NeteaseCloudMusicApi/module/artist_list')
const artist_mv = require('NeteaseCloudMusicApi/module/artist_mv')
const artist_new_mv = require('NeteaseCloudMusicApi/module/artist_new_mv')
const artist_new_song = require('NeteaseCloudMusicApi/module/artist_new_song')
const artist_songs = require('NeteaseCloudMusicApi/module/artist_songs')
const artist_sub = require('NeteaseCloudMusicApi/module/artist_sub')
const artist_sublist = require('NeteaseCloudMusicApi/module/artist_sublist')
const artist_top_song = require('NeteaseCloudMusicApi/module/artist_top_song')
const artists = require('NeteaseCloudMusicApi/module/artists')
const audio_match = require('NeteaseCloudMusicApi/module/audio_match')
const avatar_upload = require('NeteaseCloudMusicApi/module/avatar_upload')
const banner = require('NeteaseCloudMusicApi/module/banner')
const batch = require('NeteaseCloudMusicApi/module/batch')
const calendar = require('NeteaseCloudMusicApi/module/calendar')
const captcha_sent = require('NeteaseCloudMusicApi/module/captcha_sent')
const captcha_verify = require('NeteaseCloudMusicApi/module/captcha_verify')
const cellphone_existence_check = require('NeteaseCloudMusicApi/module/cellphone_existence_check')
const check_music = require('NeteaseCloudMusicApi/module/check_music')
const cloud = require('NeteaseCloudMusicApi/module/cloud')
const cloudsearch = require('NeteaseCloudMusicApi/module/cloudsearch')
const countries_code_list = require('NeteaseCloudMusicApi/module/countries_code_list')
const daily_signin = require('NeteaseCloudMusicApi/module/daily_signin')

const dj_banner = require('NeteaseCloudMusicApi/module/dj_banner')
const dj_category_excludehot = require('NeteaseCloudMusicApi/module/dj_category_excludehot')
const dj_category_recommend = require('NeteaseCloudMusicApi/module/dj_category_recommend')
const dj_catelist = require('NeteaseCloudMusicApi/module/dj_catelist')
const dj_detail = require('NeteaseCloudMusicApi/module/dj_detail')
const dj_hot = require('NeteaseCloudMusicApi/module/dj_hot')
const dj_personalize_recommend = require('NeteaseCloudMusicApi/module/dj_personalize_recommend')
const dj_program = require('NeteaseCloudMusicApi/module/dj_program')
const dj_program_detail = require('NeteaseCloudMusicApi/module/dj_program_detail')
const dj_program_toplist = require('NeteaseCloudMusicApi/module/dj_program_toplist')

const dj_radio_hot = require('NeteaseCloudMusicApi/module/dj_radio_hot')
const dj_recommend = require('NeteaseCloudMusicApi/module/dj_recommend')
const dj_recommend_type = require('NeteaseCloudMusicApi/module/dj_recommend_type')
const dj_sub = require('NeteaseCloudMusicApi/module/dj_sub')
const dj_sublist = require('NeteaseCloudMusicApi/module/dj_sublist')
const dj_toplist = require('NeteaseCloudMusicApi/module/dj_toplist')
const dj_toplist_popular = require('NeteaseCloudMusicApi/module/dj_toplist_popular')
const fm_trash = require('NeteaseCloudMusicApi/module/fm_trash')
const history_recommend_songs = require('NeteaseCloudMusicApi/module/history_recommend_songs')
const history_recommend_songs_detail = require('NeteaseCloudMusicApi/module/history_recommend_songs_detail')

const like = require('NeteaseCloudMusicApi/module/like')
const likelist = require('NeteaseCloudMusicApi/module/likelist')

const login = require('NeteaseCloudMusicApi/module/login')
const login_cellphone = require('NeteaseCloudMusicApi/module/login_cellphone')
// 二维码登录
const login_qr_key = require('NeteaseCloudMusicApi/module/login_qr_key')
const login_qr_create = require('NeteaseCloudMusicApi/module/login_qr_create')
const login_qr_check = require('NeteaseCloudMusicApi/module/login_qr_check')

const login_refresh = require('NeteaseCloudMusicApi/module/login_refresh')
const login_status = require('NeteaseCloudMusicApi/module/login_status')
const logout = require('NeteaseCloudMusicApi/module/logout')
const register_cellphone = require('NeteaseCloudMusicApi/module/register_cellphone')

const lyric = require('NeteaseCloudMusicApi/module/lyric')

const mv_all = require('NeteaseCloudMusicApi/module/mv_all')
const mv_detail = require('NeteaseCloudMusicApi/module/mv_detail')
const mv_detail_info = require('NeteaseCloudMusicApi/module/mv_detail_info')
const mv_first = require('NeteaseCloudMusicApi/module/mv_first')
const mv_sub = require('NeteaseCloudMusicApi/module/mv_sub')
const mv_sublist = require('NeteaseCloudMusicApi/module/mv_sublist')
const mv_url = require('NeteaseCloudMusicApi/module/mv_url')

const personal_fm = require('NeteaseCloudMusicApi/module/personal_fm')
const personalized = require('NeteaseCloudMusicApi/module/personalized')
const personalized_mv = require('NeteaseCloudMusicApi/module/personalized_mv')
const personalized_djprogram = require('NeteaseCloudMusicApi/module/personalized_djprogram')
const personalized_newsong = require('NeteaseCloudMusicApi/module/personalized_newsong')
const personalized_privatecontent = require('NeteaseCloudMusicApi/module/personalized_privatecontent')
const personalized_privatecontent_list = require('NeteaseCloudMusicApi/module/personalized_privatecontent_list')

const playlist_catlist = require('NeteaseCloudMusicApi/module/playlist_catlist')
const playlist_cover_update = require('NeteaseCloudMusicApi/module/playlist_cover_update')
const playlist_create = require('NeteaseCloudMusicApi/module/playlist_create')
const playlist_delete = require('NeteaseCloudMusicApi/module/playlist_delete')
const playlist_desc_update = require('NeteaseCloudMusicApi/module/playlist_desc_update')
const playlist_detail = require('NeteaseCloudMusicApi/module/playlist_detail')
const playlist_detail_dynamic = require('NeteaseCloudMusicApi/module/playlist_detail_dynamic')
const playlist_hot = require('NeteaseCloudMusicApi/module/playlist_hot')
const playlist_mylike = require('NeteaseCloudMusicApi/module/playlist_mylike')
const playlist_tracks = require('NeteaseCloudMusicApi/module/playlist_tracks')
const playlist_video_recent = require('NeteaseCloudMusicApi/module/playlist_video_recent')
const playlist_subscribe = require('NeteaseCloudMusicApi/module/playlist_subscribe')
const program_recommend = require('NeteaseCloudMusicApi/module/program_recommend')

const recommend_resource = require('NeteaseCloudMusicApi/module/recommend_resource')
const recommend_songs = require('NeteaseCloudMusicApi/module/recommend_songs')

const related_allvideo = require('NeteaseCloudMusicApi/module/related_allvideo')
const related_playlist = require('NeteaseCloudMusicApi/module/related_playlist')

const resource_like = require('NeteaseCloudMusicApi/module/resource_like')
const scrobble = require('NeteaseCloudMusicApi/module/scrobble')
const search = require('NeteaseCloudMusicApi/module/search')
const search_default = require('NeteaseCloudMusicApi/module/search_default')
const search_hot = require('NeteaseCloudMusicApi/module/search_hot')
const search_hot_detail = require('NeteaseCloudMusicApi/module/search_hot_detail')
const search_multimatch = require('NeteaseCloudMusicApi/module/search_multimatch')

const simi_artist = require('NeteaseCloudMusicApi/module/simi_artist')
const simi_mv = require('NeteaseCloudMusicApi/module/simi_mv')
const simi_playlist = require('NeteaseCloudMusicApi/module/simi_playlist')
const simi_song = require('NeteaseCloudMusicApi/module/simi_song')
const simi_user = require('NeteaseCloudMusicApi/module/simi_user')

const song_detail = require('NeteaseCloudMusicApi/module/song_detail')
const song_order_update = require('NeteaseCloudMusicApi/module/song_order_update')
const song_url = require('NeteaseCloudMusicApi/module/song_url')
const top_album = require('NeteaseCloudMusicApi/module/top_album')
const top_artists = require('NeteaseCloudMusicApi/module/top_artists')
const top_list = require('NeteaseCloudMusicApi/module/top_list')
const top_mv = require('NeteaseCloudMusicApi/module/top_mv')
const top_playlist = require('NeteaseCloudMusicApi/module/top_playlist')
const top_playlist_highquality = require('NeteaseCloudMusicApi/module/top_playlist_highquality')
const top_song = require('NeteaseCloudMusicApi/module/top_song')
const toplist = require('NeteaseCloudMusicApi/module/toplist')

const user_account = require('NeteaseCloudMusicApi/module/user_account')
const user_audio = require('NeteaseCloudMusicApi/module/user_audio')
const user_binding = require('NeteaseCloudMusicApi/module/user_binding')
const user_bindingcellphone = require('NeteaseCloudMusicApi/module/user_bindingcellphone')
const user_cloud = require('NeteaseCloudMusicApi/module/user_cloud')
const user_cloud_detail = require('NeteaseCloudMusicApi/module/user_cloud_detail')
const user_cloud_del = require('NeteaseCloudMusicApi/module/user_cloud_del')
const user_detail = require('NeteaseCloudMusicApi/module/user_detail')
const user_dj = require('NeteaseCloudMusicApi/module/user_dj')

const user_level = require('NeteaseCloudMusicApi/module/user_level')
const user_playlist = require('NeteaseCloudMusicApi/module/user_playlist')
const user_record = require('NeteaseCloudMusicApi/module/user_record')

const video_category_list = require('NeteaseCloudMusicApi/module/video_category_list')
const video_detail = require('NeteaseCloudMusicApi/module/video_detail')
const video_detail_info = require('NeteaseCloudMusicApi/module/video_detail_info')
const video_group = require('NeteaseCloudMusicApi/module/video_group')
const video_group_list = require('NeteaseCloudMusicApi/module/video_group_list')
const video_url = require('NeteaseCloudMusicApi/module/video_url')

const record_recent_song = require('NeteaseCloudMusicApi/module/record_recent_song')
const record_recent_album = require('NeteaseCloudMusicApi/module/record_recent_album')
const record_recent_playlist = require('NeteaseCloudMusicApi/module/record_recent_playlist')
const record_recent_video = require('NeteaseCloudMusicApi/module/record_recent_video')
const record_recent_dj = require('NeteaseCloudMusicApi/module/record_recent_dj')
const record_recent_voice = require('NeteaseCloudMusicApi/module/record_recent_voice')

import others from './otherapi'
export default {
  '/fm_trash': generatorFn(fm_trash),
  '/history/recommend/songs/detail': generatorFn(history_recommend_songs_detail),
  '/history/recommend/songs': generatorFn(history_recommend_songs),
  '/like': generatorFn(like),
  '/likelist': generatorFn(likelist),
  '/login/cellphone': generatorFn(login_cellphone),
  '/login/refresh': generatorFn(login_refresh),
  '/login/status': generatorFn(login_status),
  '/login/qr/key': generatorFn(login_qr_key),
  '/login/qr/create': generatorFn(login_qr_create),
  '/login/qr/check': generatorFn(login_qr_check),
  '/login': generatorFn(login),
  '/logout': generatorFn(logout),
  '/lyric': generatorFn(lyric),
  '/mv/all': generatorFn(mv_all),
  '/mv/detail/info': generatorFn(mv_detail_info),
  '/mv/detail': generatorFn(mv_detail),
  '/mv/first': generatorFn(mv_first),
  '/mv/sub': generatorFn(mv_sub),
  '/mv/sublist': generatorFn(mv_sublist),
  '/mv/url': generatorFn(mv_url),
  '/personalized/mv': generatorFn(personalized_mv),
  '/personal_fm': generatorFn(personal_fm),
  '/personalized/djprogram': generatorFn(personalized_djprogram),
  '/personalized/newsong': generatorFn(personalized_newsong),
  '/personalized/privatecontent': generatorFn(personalized_privatecontent),
  '/personalized/privatecontent/list': generatorFn(personalized_privatecontent_list),
  '/personalized': generatorFn(personalized),
  '/playlist/catlist': generatorFn(playlist_catlist),
  '/playlist/cover/update': generatorFn(playlist_cover_update),
  '/playlist/create': generatorFn(playlist_create),
  '/playlist/delete': generatorFn(playlist_delete),
  '/playlist/desc/update': generatorFn(playlist_desc_update),
  '/playlist/detail/dynamic': generatorFn(playlist_detail_dynamic),
  '/playlist/detail': generatorFn(playlist_detail),
  '/playlist/hot': generatorFn(playlist_hot),
  '/playlist/mylike': generatorFn(playlist_mylike),
  '/playlist/tracks': generatorFn(playlist_tracks),
  '/playlist/video/recent': generatorFn(playlist_video_recent),
  '/playlist/subscribe': generatorFn(playlist_subscribe),
  '/program/recommend': generatorFn(program_recommend),
  '/recommend/resource': generatorFn(recommend_resource),
  '/recommend/songs': generatorFn(recommend_songs),
  '/register/cellphone': generatorFn(register_cellphone),
  '/related/allvideo': generatorFn(related_allvideo),
  '/related/playlist': generatorFn(related_playlist),
  '/resource/like': generatorFn(resource_like),
  '/scrobble': generatorFn(scrobble),
  '/search': generatorFn(search),
  '/search/default': generatorFn(search_default),
  '/search/hot/detail': generatorFn(search_hot_detail),
  '/search/hot': generatorFn(search_hot),
  '/search/multimatch': generatorFn(search_multimatch),
  '/simi/artist': generatorFn(simi_artist),
  '/simi/mv': generatorFn(simi_mv),
  '/simi/playlist': generatorFn(simi_playlist),
  '/simi/song': generatorFn(simi_song),
  '/simi/user': generatorFn(simi_user),
  '/song/detail': generatorFn(song_detail),
  '/song/order_update': generatorFn(song_order_update),
  '/song/url': generatorFn(song_url),
  '/top/album': generatorFn(top_album),
  '/top/artists': generatorFn(top_artists),
  '/top/list': generatorFn(top_list),
  '/top/mv': generatorFn(top_mv),
  '/top/playlist': generatorFn(top_playlist),
  '/top/playlist/highquality': generatorFn(top_playlist_highquality),
  '/top/song': generatorFn(top_song),
  '/toplist': generatorFn(toplist),

  '/user/account': generatorFn(user_account),
  '/user/audio': generatorFn(user_audio),
  '/user/binding': generatorFn(user_binding),
  '/user/bindingcellphone': generatorFn(user_bindingcellphone),
  '/user/cloud': generatorFn(user_cloud),
  '/user/cloud/del': generatorFn(user_cloud_del),
  '/user/cloud/detail': generatorFn(user_cloud_detail),
  '/user/detail': generatorFn(user_detail),
  '/user/dj': generatorFn(user_dj),
  '/user/level': generatorFn(user_level),
  '/user/playlist': generatorFn(user_playlist),
  '/user/record': generatorFn(user_record),

  '/video/category/list': generatorFn(video_category_list),
  '/video/detail/info': generatorFn(video_detail_info),
  '/video/detail': generatorFn(video_detail),
  '/video/group/list': generatorFn(video_group_list),
  '/video/group': generatorFn(video_group),
  '/video/url': generatorFn(video_url),

  '/dj/category/recommend': generatorFn(dj_category_recommend),
  '/dj/category/excludehot': generatorFn(dj_category_excludehot),
  '/dj/catelist': generatorFn(dj_catelist),
  '/dj/detail': generatorFn(dj_detail),
  '/dj/hot': generatorFn(dj_hot),
  '/dj/personalize/recommend': generatorFn(dj_personalize_recommend),
  '/dj/program/toplist': generatorFn(dj_program_toplist),
  '/dj/program/detail': generatorFn(dj_program_detail),
  '/dj/program': generatorFn(dj_program),
  '/dj/radio/hot': generatorFn(dj_radio_hot),
  '/dj/recommend/type': generatorFn(dj_recommend_type),
  '/dj/recommend': generatorFn(dj_recommend),
  '/dj/sublist': generatorFn(dj_sublist),
  '/dj/sub': generatorFn(dj_sub),
  '/dj/toplist/popular': generatorFn(dj_toplist_popular),
  '/dj/toplist': generatorFn(dj_toplist),
  '/dj/banner': generatorFn(dj_banner),

  '/cellphone/existence/check': generatorFn(cellphone_existence_check),
  '/check/music': generatorFn(check_music),
  '/cloud': generatorFn(cloud),
  '/cloudsearch': generatorFn(cloudsearch),
  '/countries/code/list': generatorFn(countries_code_list),
  '/daily_signin': generatorFn(daily_signin),

  '/audio/match': generatorFn(audio_match),
  '/avatar/upload': generatorFn(avatar_upload),
  '/banner': generatorFn(banner),
  '/batch': generatorFn(batch),
  '/calendar': generatorFn(calendar),
  '/captcha/sent': generatorFn(captcha_sent),
  '/captcha/verify': generatorFn(captcha_verify),

  '/artists': generatorFn(artists),
  '/artist/top/song': generatorFn(artist_top_song),
  '/artist/sublist': generatorFn(artist_sublist),
  '/artist/sub': generatorFn(artist_sub),
  '/artist/songs': generatorFn(artist_songs),
  '/artist/new/song': generatorFn(artist_new_song),
  '/artist/new/mv': generatorFn(artist_new_mv),
  '/artist/mv': generatorFn(artist_mv),
  '/artist/list': generatorFn(artist_list),
  '/artist/detail': generatorFn(artist_detail),
  '/artist/desc': generatorFn(artist_desc),
  '/artist/album': generatorFn(artist_album),

  '/album/sublist': generatorFn(album_sublist),
  '/album/sub': generatorFn(album_sub),
  '/album/songsaleboard': generatorFn(album_songsaleboard),
  '/album/newest': generatorFn(album_newest),
  '/album/new': generatorFn(album_new),
  '/album/list/style': generatorFn(album_list_style),
  '/album/list': generatorFn(album_list),
  '/album/detail/dynamic': generatorFn(album_detail_dynamic),
  '/album/detail': generatorFn(album_detail),
  '/album': generatorFn(album),
  '/activate_init_profile': generatorFn(activate_init_profile),

  '/record/recent/song': generatorFn(record_recent_song),
  '/record/recent/playlist': generatorFn(record_recent_playlist),
  '/record/recent/album': generatorFn(record_recent_album),
  '/record/recent/dj': generatorFn(record_recent_dj),
  '/record/recent/video': generatorFn(record_recent_video),
  '/record/recent/voice': generatorFn(record_recent_voice),

  ...others,
}

function generatorFn(module: any) {
  return (req: any, res: any) => {
    ;[req.query, req.body].forEach((item) => {
      if (typeof item.cookie === 'string') {
        item.cookie = cookieToJson(decode(item.cookie))
      }
    })
    const query = Object.assign({}, { cookie: req.cookies }, req.query, req.body, req.files)
    module(query, request)
      .then((answer) => {
        console.log('[OK]', decode(req.originalUrl))
        const cookies = answer.cookie
        if (Array.isArray(cookies) && cookies.length > 0) {
          if (req.protocol === 'https') {
            // Try to fix CORS SameSite Problem
            res.append(
              'Set-Cookie',
              cookies.map((cookie) => {
                return cookie + '; SameSite=None; Secure'
              })
            )
          } else {
            res.append('Set-Cookie', cookies)
          }
        }
        res.status(answer.status).send(answer.body)
      })
      .catch((answer) => {
        console.log('[ERR]', decode(req.originalUrl), {
          status: answer.status,
          body: answer.body,
        })
        if (!answer.body) {
          res.status(404).send({
            code: 404,
            data: null,
            msg: 'Not Found',
          })
          return
        }
        if (answer.body.code == '301') answer.body.msg = '需要登录'
        res.append('Set-Cookie', answer.cookie)
        res.status(answer.status).send(answer.body)
      })
  }
}
