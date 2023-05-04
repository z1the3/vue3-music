// 在每一首歌前加上歌手名
export function processArtists(songs){
  if(!songs) return
    return songs.map((song)=>{
      let artistsNames =  song.artists?.map((artist)=>{
        return artist.name
      }).join('/')
      if(artistsNames){
        artistsNames+='-'
      }
      song.artistsNames = artistsNames
  
      return song
    })
  }