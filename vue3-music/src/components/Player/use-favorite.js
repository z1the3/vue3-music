import useSongListStore from '../../store'
import {computed} from 'vue'
import {save,remove} from '../../assets/js/array-store'
import {FAVORITE_KEY} from '../../assets/js/constant'

export default function useFavorite() {
    const store = useSongListStore()
    const favoriteList = computed(()=>store.favoriteList)
    const maxLen = 100

    // 判断是否favorite并生成类名
    function getFavoriteIcon(song){
        return isFavorite(song)?'icon-favorite' : 'icon-not-favorite'
    }

    function isFavorite(song){
        // favoriteList要初始化，否则只有computed依赖更新
        // 才会去内存中第一次拿数据
        
        return favoriteList.value.findIndex((item)=>{
            return (item.id===song?.id)
        }) > -1
    }

    function toggleFavorite(song) {
        let list
        if(isFavorite(song)){
            // 函数会返回新list
            list = remove(FAVORITE_KEY,compare)
        } else{
            list = save(song,FAVORITE_KEY,compare,maxLen)
        }
        function compare(item){
            return item.id===song.id
        }
        store.favoriteList =  list
    }
    return {
        getFavoriteIcon,
        toggleFavorite
    }
}

