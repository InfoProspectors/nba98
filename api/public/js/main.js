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
        axios.get("https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/json/location/area.json").then(res => {
            this.area = res.data
        }).catch(e => {
            this.$message.error(`获取区级数据出错+${e}`)
        })
        axios.get("https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/json/location/city.json").then(res => {
            this.city = res.data
        }).catch(e => {
            this.$message.error(`获取市级数据出错+${e}`)
        })
        axios.get("https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/json/location/province.json").then(res => {
            this.province = res.data
        }).catch(e => {
            this.$message.error(`获取省级数据出错+${e}`)
        })
        console.log("111")
    }
})