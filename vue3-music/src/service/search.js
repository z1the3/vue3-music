import {get} from './base'

export function getHotKeys() {
    return get('http://localhost:7777/api/getHotKeys')
    
}


export function search(query,showSinger,page=1,limit=30) {
    return get('http://localhost:7777/api/search',{
        query,
        page,
        limit,
        showSinger
    })
    
}


export function searchSuggest(query) {
    return get('http://localhost:7777/api/search/suggest',{
        query
    })
    
}