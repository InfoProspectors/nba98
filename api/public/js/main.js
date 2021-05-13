let loadingInstance

const handleData = ({data}) => {
    if (loadingInstance) loadingInstance.close()
    // 极个别情况，若将错误code设置为0时，防止识别成false影响判断
    return data
}

/**
 * @description axios初始化
 */
const instance = axios.create({
    baseURL: 'https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master',
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
    (response) => handleData(response),
    (error) => {
        const {response, config} = error
        if (response) {
            return handleData(response)
        } else {
            console.log('error', error)
            console.log('config', config)
            console.log('response', response)
            this.$message(
                `请求出错：请求链接：${config.url}，错误信息：${error}`,
                'error'
            )
            return {}
        }
    }
)

async function getLocation(Location) {
    return instance({
        url: `json/location/${Location}.json`,
        method: 'get',
    })
}

async function queryInfo(type, name) {
    return instance({
        url: `json/${type}/${name}.json`,
        method: 'get',
    })
}

new Vue({
    el: '#mainBox',
    data() {
        return {
            tableData: [],
            area: [],
            city: [],
            province: []
        }
    },
    mounted() {
        this._getLocation()
    },
    methods: {
        async _getLocation() {
            const area = await getLocation('area')
            this.area = area
            const city = await getLocation('city')
            this.city = city
            const province = await getLocation('province')
            this.province = province
            this._queryInfo('province', '北京市')
        },
        async _queryInfo(type, name) {
            const {data = []} = await queryInfo(type, name)
            this.$message(`${name}数据获取成功`);
            this.tableData = data
        }
    }
})
