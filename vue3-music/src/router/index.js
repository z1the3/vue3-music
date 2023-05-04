import {createRouter,createWebHashHistory,createWebHistory}from 'vue-router'
import Recommend from '../views/recommend.vue'
import TopList from '../views/top-list.vue'

// 魔术注释用来改变打包名
const Singer = () => import('../views/singer.vue'/*
webpackChunkName: "singer" */)
const SingerDetail = () => import('../views/singer-detail.vue'/*
webpackChunkName: "singerDetail" */
)
const Search = () => import('../views/search.vue'/*
webpackChunkName: "search" */
)
const routes = [
    {
        path:'/',
        redirect: '/singer'
    },
    {
        path:'/recommend',
        component: Recommend
    },
    {
        path:'/singer',
        component:Singer,
        children:[
            {
                path: ':id',
                component:SingerDetail
            }
        ]
    },
    {
        path:'/top',
        component:TopList
    },
    {
        path:'/search',
        component:Search
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router