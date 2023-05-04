// 该文件通过 nodejs运行，会在本地起一个devServer,负责与第三方接口
// 通信，防止浏览器跨域
// 但这里的数据处理工作，一般不需要前端去做

const axios = require('axios')
// 获取签名方法
const getSecurtiySign = require('./sign.cjs')
const pinyin = require('pinyinjs')
const api = require('NeteaseCloudMusicApi')
// 成功的状态码
const ERR_OK = 0
const token = 5381
// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'




// 公共参数
const commonParams = {
    g_tk: token,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    needNewCode: 0,
    format: 'json',
    platform: 'yqq.json'

}


// 获取随机数
function getRandomVal(prefix = '') {
    // 去掉0.获取字符串
    return prefix + (Math.random() + '').replace('0.', '').slice(0, 13)
}


// 获取一个随机 uid
function getUid() {
    const t = (new Date()).getUTCMilliseconds()
    return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}

// 获取一个随机 cid
function getCid() {
    const t = (new Date()).getUTCMilliseconds()
    return '' + Math.round(2147483647 * Math.random()) * t % 1e9
}
// 对axios get请求的封装
// 修改请求的headers值，合并公共请求参数

function get(url, params, defaultOpt = true) {

    return axios.get(url,
        {
            headers: {
                referer: 'https://y.qq.com/',
                origin: 'https://y.qq.com'
            },
            params: Object.assign({},
                defaultOpt ? commonParams : {}, params)

        }
    )
}

// 对 axios post 请求的封装
// 还是修改请求的 headers 值,注意 post 的请求头要说明 content-type
function post(url, params) {
    return axios.post(url, params, {
        headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: 'RK=sskptcsBTg; ptcz=3df8540270c44c8b3ef7e783ce59052b86d7ce449e3414dd5edf34eacf081606; pgv_pvid=9714177370; o_cookie=1813783831; pac_uid=1_1813783831; tvfe_boss_uuid=11cd432ae1601b06; ptui_loginuin=1813783831; fqm_pvqid=8e8d6161-f430-440b-b07c-70c16500a556; ts_uid=1883775366; fqm_sessionid=55b02dfd-7f4e-467a-b21b-88d95de3a6ed; pgv_info=ssid=s840217297; ts_refer=cn.bing.com/; ts_last=y.qq.com/n/ryqq/player',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        }
    })
}

// 主函数，注册后端路由(推荐)，暴露给vite启动devServer
function registerRouter(app) {
    registerRecommend(app)
    registerSingerDetail(app)
    registerSingerList(app)
    registerSongsUrl(app)
    registerLyric(app)
    registerHotKeys(app)
    registerSearch(app)
    registerSearchSuggest(app)


}


// 网友精选碟歌单

// function registerRecommend(app) {
//     app.get(`/api/getRecommend`, async (ctx, next) => {
//         const res = await api.playlist_hot({ limit: 30 })
//         if (res.status !== 200) return
//         const playlists = res.body.tags

//         const idGroups = []
//         const ids = []

//         playlists.map((playlist) => {
//             ids.push(playlist.id)
//         })
//         if (ids.length > 2) {
//             const groupLength = Math.ceil(ids.length / 2)
//             for (let i = 0; i < groupLength; i++) {
//                 idGroups.push(ids.slice(i * 2, (i + 1) * 2))
//             }
//         } else {
//             idGroups.push([...ids])
//         }


//         const playlistDetail = {}
//         async function send(){
//             for (let i = 0; i < idGroups.length; i++) {

//                 for (let j = 0; j < idGroups[i].length; j++) {
//                     new Promise(async (resolve) => {
//                         try{
//                             const res = await api.playlist_detail({ id: idGroups[i][j] })
//                             return resolve(res)
//                         }catch(e){
//                             console.log(e)
//                         }

//                     }).then((res) => {
//                         console.log(res,i,j)
//                         let info = res.body
//                         playlistDetail[info.id] = {
//                             id: info.id,
//                             name: info.name,
//                             coverImag: info.corverImgUrl,
//                             count: info.playCount,
//                             description: info.description,
//                             trackIds: info.trackIds
//                         }
//                     })

//                 }
//                 try{
//                     await new Promise((resolve) => {
//                         setTimeout(resolve, 2000)
//                     })
//                 }catch(e){
//                     console.log(e)
//                 }
//             }
    
//         }
//         try{
//             await send()
//         }catch(e){
//             console.log(e)
//         }

//         console.log(playlistDetail)
//         ctx.body = {
//             code: ERR_OK,
//             result: {
//                 map: playlistDetail
//             }
//         }
//         next()


//     })

// }

// 注册推荐列表接口路由
function registerRecommend(app) {


    
    // 监听对此url的get请求
    app.get(`/api/getRecommend`, async (ctx, next) => {
        // 第三方接口服务器的url
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        // 构造请求data参数,第三方服务器规定的格式
        const data = JSON.stringify({
            comm: { ct: 24 },
            recomPlayList: {
                method: 'get_hot_recommend',
                param: { async: 1, cmd: 2 },
                module: 'playlist.HotRecommendServer'
            },
            focus: {
                module: 'music.musicHall.MusicHallPlatform',
                method: 'GetFocus', param: {}
            }

        })
        // 随机数值
        const randomVal = getRandomVal('recom')
        // 计算签名值
        const sign = getSecurtiySign(data)

        // 发送get请求 
        await get(url, {
            sign,
            '-': randomVal,
            data
        }).then((res) => {
            const data = res.data
            if (data.code === ERR_OK) {
                // 处理轮播图数据
                // todos
                const focusList = data.focus.data.shelf.v_niche[0].v_card
                // 存放所有轮播图
                const sliders = []
                // 用于查看歌曲详情时快捷加上前缀
                const jumpPrefixMap = {
                    10002: 'https://y.qq.com/n/yqq/album/',
                    10014: 'https://y.qq.com/n/yqq/playlist/',
                    10012: 'https://y.qq.com/n/yqq/mv/v'
                }
                // 最多获取十条数据,取两者最小
                const len = Math.min(focusList.length, 10)
                for (let i = 0; i < len; i++) {
                    const item = focusList[i]
                    const sliderItem = {}
                    // 单个轮播图数据包括id,pic,link等字段
                    sliderItem.id = item.id
                    sliderItem.pic = item.cover
                    if (jumpPrefixMap[item.jumptype]) {
                        sliderItem.link = jumpPrefixMap[item.jumptype]
                            + (item.subid || item.id) + '.html'
                    } else if (item.jumptype === 3001) {
                        sliderItem.link = item.id
                    }
                    sliders.push(sliderItem)
                }


                // 处理推荐歌单数据
                const albumList = data.recomPlayList.data.v_hot
                const albums = []
                for (let i = 0; i < albumList.length; i++) {
                    const item = albumList[i]
                    const albumItem = {}
                    // 推荐歌单数据包括id,username,title,pic等字段
                    albumItem.id = item.content_id
                    albumItem.username = item.username
                    albumItem.title = item.title
                    albumItem.pic = item.cover

                    albums.push(albumItem)
                }
                // 代理服务器往前端发送响应数据，但是这里没做错误情况
                // 发送响应数据通过 res.json()
                // res.json({
                //     code: ERR_OK,
                //     result: {
                //         sliders,
                //         albums
                //     }
                // })
                ctx.body = {
                    code: ERR_OK,
                    result: {
                        sliders,
                        albums
                    }
                }
                // 如果请求第三方失败，直接返回data
            } else {
                // res.json(data)
                ctx.body = {
                    code: ERR_OK,
                    result: {
                        sliders,
                        albums
                    }
                }
            }
        })
        next()
    })
}

// 注册歌手列表接口路由
function registerSingerList(app) {
    app.get(`/api/getSingerList`, async (ctx, next) => {
        const res = await api.artist_list({ area: '8', limit: '100' })

        if (res.status = '200') {
            const singerList = res.body.artists
            const unKnownLetter = []
            const HOT_NAME = "热"
            // 构造歌手MAP数据结构,第一个为排名前十的歌手，名为热
            const singerMap = {
                hot: {
                    title: HOT_NAME,
                    list: map(singerList.slice(0, 10))
                },
                '#': {
                    title: '#',
                    list: unKnownLetter
                }
            }
            singerList.forEach((item) => {
                // 把歌手名转成拼音,借助第三方库pinyin
                const p = pinyin(item.name, {})
                if (!p || !p.length) {
                    unKnownLetter.push(item)
                }
                // 获取歌手名拼音的首字母
                const key = p[0][0].slice(0, 1).toUpperCase()
                if (key) {
                    if (!singerMap[key]) {
                        singerMap[key] = {
                            title: key,
                            list: []
                        }
                    }
                    singerMap[key].list.push(map([item])[0])
                }
            })


            // 热门歌手
            const hot = []
            // 字母歌手
            const letter = []
            // 未知名
            const unknown = []

            // 遍历处理singerMap,里面有26个字母和热
            for (const key in singerMap) {
                const item = singerMap[key]
                // 如果标题是字母
                if (item.title.match(/[a-zA-Z]/)) {
                    letter.push(item)
                } else if (item.title === HOT_NAME) {
                    hot.push(item)
                } else if (item.title === '#') {
                    unknown.push(item)
                }
            }
            // 按字母顺序排序letter
            letter.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            ctx.body = {
                code: ERR_OK,
                result: {
                    singers: hot.concat(letter, unknown)
                }
            }
        } else {
            ctx.body = {
                code: 404
            }
        }

        next()
    })
    // 做一层数据映射，构造为我们需要的singerList
    function map(singerList) {
        return singerList.map((item) => ({
            id: item.id,
            name: item.name,
            pic: item.picUrl,
            musicSize: item.musicSize
        }))
    }
}



// 注册歌手详情接口路由
function registerSingerDetail(app) {
    app.get(`/api/getSingerDetail`, async (ctx, next) => {
        // 发送get请求 
        await api.artist_top_song({ id: ctx.query.id })
            .then((res) => {
                const data = res.body
                //封装相似逻辑，歌单和榜单想详情
                const songList = handleSongList(data.songs)
                ctx.body = {
                    code: ERR_OK,
                    result: {
                        songs: songList
                    }
                }
            }
            )
        next()
    })
}
function handleSongList(list) {
    const songList = []
    list.forEach((item) => {
        const info = item

        // 构造歌曲的数据结构
        const song = {
            id: info.id,
            name: info.name,
            singer: mergeSinger(info.ar),
            url: '',//在另一个接口获取
            duration: info.dt,
            pic: info.al.picUrl ? info.al.picUrl : fallbackPicUrl,
            album: info.al.name,
            tns: info.ts
        }
        songList.push(song)


        function mergeSinger(singer) {
            const singers = []
            singer.forEach((item) => {
                singers.push({ id: item.id, name: item.name })
            })
            return singers
        }

    })
    return songList
}

// 歌曲url获取接口路由
function registerSongsUrl(app) {
    app.get(`/api/getSongsUrl`, async (ctx, next) => {
        if(ctx.query['id']){
            const id = ctx.query['id']
            let des = await api.song_url({ id})
            des = des.body.data
            ctx.body = {
                code: ERR_OK,
                result: {
                    map:{id:des.url}
                }
            }
            next()
            return
        }
        const mids = ctx.query['id[]']
        const midGroup = []
        if (mids.length > 100) {
            const groupLength = Math.ceil(mids.length / 100)
            for (let i = 0; i < groupLength; i++) {
                midGroup.push(mids.slice(i * 100, (i + 1) * 100))
            }
        } else {
            midGroup.push([...mids])
        }

        // 返回的表，已歌曲的id为key，值为url
        let urlMap = {}
        // 构造多个promise请求
        const requests = midGroup.map((mid) => {
            return process(mid)
        })
        // 处理返回的mid
        async function process(mid) {
            const res = await api.song_url({ id: mid })
            // console.log(res.body.data)
            const info = res.body.data
            info.map((item) => {
                urlMap[item.id] = item.url
            })
        }

        // 并行发送多个请求
        await Promise.all(requests).then(() => {
            ctx.body = {
                code: ERR_OK,
                result: {
                    map: urlMap
                }
            }
        })
        next()
    })
}

// 注册歌词接口
function registerLyric(app) {
    app.get(`/api/getLyric`, async (ctx, next) => {
        await api.lyric({ id: ctx.query.id })
            .then((res) => {
                const data = res.body.lrc.lyric
                ctx.body = {
                    code: ERR_OK,
                    result: {
                        lyric: data
                    }
                }
            })
        next()

    })
}

// 注册热门搜索接口

function registerHotKeys(app){
    app.get(`/api/getHotKeys`,async(ctx,next)=>{
        const res = await api.search_hot()
        ctx.body = {
            code: ERR_OK,
            result: {
                hotKeys: res.body.result.hots
            }
        }
        next()
    })
}

// 注册搜索建议接口

function registerSearchSuggest(app){
    app.get(`/api/search/suggest`,async (ctx,next)=>{
        const {query} = ctx.query
        const res = await api.search_suggest({keywords:query})
        let hasMore = false
        if(res.body.result?.songs&&res.body.result?.artists){
            hasMore = true
        }
        console.log(query,res)
        ctx.body = {
            code: ERR_OK,
            result: {
                suggest: res.body,
                hasMore
            }
        }
        next()
    })
}

function registerSearch(app){
    app.get(`/api/search`,async (ctx,next)=>{
        const {query,page,limit,showSinger} = ctx.query
        const offset = (page - 1) * limit
        const res = await api.search({keywords:query,offset,limit,type:showSinger?1:100})
        console.log(res)
        ctx.body = {
            code: ERR_OK,
            result: {
                searchRes: res.body
            }
        }
        next()

    })
}

module.exports = registerRouter