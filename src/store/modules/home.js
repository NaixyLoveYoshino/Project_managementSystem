import morkRequest from '@/utils/mock_request'
const state = {
    list: {}
}

const mutations = {
    GETdATA(state, list) {
        state.list = list
    }
}

const actions = {
    // 发请求获取首页mocks数据
    async getData({ commit }) {
        let result = await morkRequest.get("/home/list")
        if (result.code == 20000) {
            commit("GETdATA", result.data)
        }
    }
}

const getters = {

}

export default {
    state, mutations, actions, getters
}

