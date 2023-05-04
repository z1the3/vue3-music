import { get } from './base'

export function getSingerList() {
    return get('http://localhost:7777/api/getSingerList')
}   

export function getSingerDetail(singer) {
    // axios添加query参数的方式
    return get('http://localhost:7777/api/getSingerDetail',{
        id:singer.id
    })
}   