import {get} from './base'

export function getRecommend() {
    return get('http://localhost:7777/api/getRecommend')
    
}