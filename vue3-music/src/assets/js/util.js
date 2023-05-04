

export function shuffle(source){
        const arr = source.slice()
    for(let i = 0;i<arr.length;i++){
        // 拿到的是index
        const j = getRandom(i)
        swap(arr,i,j)
    }
    return arr
}

function getRandom(max){
    return Math.floor(Math.random() * (max+1))
}

function swap(arr,i,j){
    const t= arr[i]
    arr[i] = arr[j]
    arr[j] = t
}


// 时间格式化
export function formatTime(interval){
    // 去除小数
    const interval_ = interval | 0
    const minute = ((interval_ /60 |0)+ '').padStart(2,'0')
    const second = (interval_ % 60 + '').padStart(2,'0')
    return `${minute}:${second}`
}