import { get } from './base'


// 传入歌曲列表，返回携带url的歌曲，之前url字段为空
export function processSongs(songs) {
    let id
    if(Array.isArray(songs)){
        id =songs.map((song)=> {
            return song.id
        })
    }else{
        id = songs.id
    }

    return get('http://localhost:7777/api/getSongsUrl',{
        id
    }).then((res)=>{
        if(!res) return
        return res
        // if(Array.isArray(songs)){
        //     return songs.map((song)=> {
        //         song.url = res.map[song.id]
        //         return song
        //     })
        // }else{
        //     songs.url = res.map[songs.id]
        //     return songs
        // }
    })
}   

// 获取歌词的请求
const lyricMap = {}
export function getLyric(song){
    if(song.lyric) {
        return Promise.resolve(song.lyric)
    }
    const id = song.id
    if(lyricMap[id]){
        return Promise.resolve(lyricMap[id])
    }
    return get('http://localhost:7777/api/getLyric',{
        id
    }).then((res)=>{
        const lyric = res.lyric.length?res.lyric:'[00:00.00] 该歌曲暂时无法获取歌词'
        lyricMap[id] = lyric
        return lyric
    })
}