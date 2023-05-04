const koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const registerRouter = require('./router.cjs')

const listenServer = ()=>{
    const app = new koa()
    const router = new Router()
    registerRouter(router)
    app.use(cors())
    app.use(router.routes())

    app.listen(7777)
}
module.exports = listenServer
