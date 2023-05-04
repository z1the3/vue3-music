import {defineStore} from 'pinia'
import actions from './actions'
import state from './state'
import {currentSong} from './getters'

const useSongListStore = defineStore('storeId',{
    state:()=>(state),
    getters:{
        currentSong
    },
    actions:actions.actions

})

export default useSongListStore