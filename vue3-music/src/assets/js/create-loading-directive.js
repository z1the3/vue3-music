import {createApp} from 'vue'
import {addClass,removeClass} from './dom'



// 相对定位的样式,在全局scss文件已经添加，是一个position:relative
const relativeCls = 'g-relative'
export default function createLoadingLikeDirective(Comp){
    let scopedApp
    let scopedName

    function append(el){
        // 在el一个专门的属性上存储组件
        const style = getComputedStyle(el)
        if(['absolute','fixed','relative'].indexOf(style.position)
        ===-1){
            addClass(el,relativeCls)
        }

        el.appendChild(el[scopedName].instance.$el)

    }
    
    function remove(el){
        removeClass(el,relativeCls)
        // 先判断是否拥有该元素，否则会报错
        if(el.contains(el[scopedName].instance.$el)){
            el.removeChild(el[scopedName].instance.$el)

        }
    }
    return {
        mounted(el,binding) {
            const app = createApp(Comp)
            const name = Comp.name
            if(!scopedName){
                scopedName = name
            }
            if(!scopedApp){
                scopedApp = app
            }
            // 同一个组件使用两种指令会出bug，el.instance会覆盖
            const instance = app.mount(document.createElement('div'))
            el[name] = {}
            el[name].instance = instance
            if(binding.value){
                append(el)
            }
            // 使用动态绑定,使用方法，v-loading:[loadingText]='..
            const title = binding.arg
            if(typeof title!=='undefined'){
                // console.log(el.instance)
                app._instance.setTitle(title)
            }
        },
        // 组件更新后会触发这个钩子,可以比较bind值有没有发生改变
        updated(el,binding){
            // 使用动态绑定,找到:title
            const title = binding.arg
            if(typeof title!=='undefined'){
                scopedApp._instance.setTitle(title)
            }
            if(binding.value!==binding.oldValue){
                binding.value? append(el):remove(el)
            }
        }
    }
}





