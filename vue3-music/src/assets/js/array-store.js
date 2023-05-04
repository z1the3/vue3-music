// 本地缓存里维护一个数组

import storage from 'good-storage'


// 用户自定义比对函数
function insertArray(arr,val,compare,maxLen){
    const index = arr.findIndex(compare)
    if(index>-1){
        return
    }
    arr.unshift(val)
    if(maxLen&&arr.length>maxLen){
        arr.pop()
    }
}


export function save(item,key,compare,maxLen){
    const items = storage.get(key,[])
    insertArray(items,item,compare,maxLen)
    storage.set(key,items)
    return items
}


function deleteFromArray(arr,compare) {
    const index = arr.findIndex(compare)
    if(index>-1){
        arr.splice(index,1)
    }
}

export function remove(key,compare){
    const items = storage.get(key,[])
    deleteFromArray(items,compare)
    storage.set(key,items)
    return items
}


// 初始化数据
export function load(key) {
    return storage.get(key,[])
}