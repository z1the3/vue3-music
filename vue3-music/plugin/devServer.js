const listenServer = require('../backend/server')

export default function devServerPlugin() {
    listenServer()
    // 创建虚拟文件
    const virtualFileId = '@dev-server-plugin'
    return {
        name: 'dev-server-plugin',
        resolveId(id) {
            if(id === virtualFileId){
                return virtualFileId
            }
        }
    }
}