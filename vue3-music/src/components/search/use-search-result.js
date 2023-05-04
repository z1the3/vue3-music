import {search} from '../../service/search'
import {ref} from 'vue'
import {processArtists} from './util'

export const useSearchResult = ()=>{
    const stopSuggestion = ref(false)
    // watch(query,(newQuery)=>{
    //     searchResult(newQuery)
    // })
    const result = ref([])

    // 异步
    const searchResult = async (query)=>{
        stopSuggestion.value = true
        const res = await search(query,true)
        const res1 = processArtists(res.searchRes.result.songs)
        res.searchRes.result.songs = res1
        result.value = res.searchRes.result
    }


    return {
        result,
        stopSuggestion,
        searchResult
    }
}