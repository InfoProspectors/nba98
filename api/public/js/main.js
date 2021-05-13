let loadingInstance
const baseURL = 'https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master'
const basexslURL = 'https://first-love-cloud.github.io/nba98/xls'
const handleData = ({data}) => {
    if (loadingInstance) loadingInstance.close()
    // 极个别情况，若将错误code设置为0时，防止识别成false影响判断
    return data
}

/**
 * @description axios初始化
 */
const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 10 * 3,
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
        url: encodeURI(`json/location/${Location}.json`),
        method: 'get',
    })
}

async function queryInfo(type, name) {
    return instance({
        url: encodeURI(`json/${type}/${name}.json`),
        method: 'get',
    })
}
// 将csv转换成表格
function csv2table(csv)
{
    var html = '<table>';
    var rows = csv.split('\n');
    rows.pop(); // 最后一行没用的
    rows.forEach(function(row, idx) {
        var columns = row.split(',');
        columns.unshift(idx+1); // 添加行索引
        if(idx == 0) { // 添加列索引
            html += '<tr>';
            for(var i=0; i<columns.length; i++) {
                html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
            }
            html += '</tr>';
        }
        html += '<tr>';
        columns.forEach(function(column) {
            html += '<td>'+column+'</td>';
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}


console.log(provinceAndCityData)
new Vue({
    el: '#mainBox',
    data() {
        return {
            options: [],
            areaSelectData: regionDataPlus, // options绑定的数据就是引入的 provinceAndCityData
            selectedOptions: [],
            showLeft: false,
            tableData: [],
            cityname:'',
            area: [],
            city: [],
            province: [],
            activeName:'table',
            citytype:'',
            xlsurl:'',
            xlshtml:''
        }
    },
    mounted() {
        this._getLocation()
    },
    methods: {
        handleChange(e) {
            let len = e.length
            let name = CodeToText[`${e.pop()}`]
            if(!len){
                return
            }
            switch (len) {
                case 1:
                    this._queryInfo('province', name)
                    break
                case 2:
                    this._queryInfo('city', name)
                    break
                case 3:
                    this._queryInfo('area', name)
                    break
                default:
                    console.log(len)
            }
        },
        async _getLocation() {
            console.log("\n".concat(" %c python 是世界上最好的爬虫框架", " | ", "https://www.python.org/"), "color: #fadfa3; background: #030307; padding:5px 0;")
            console.log("\n %c vue 是世界上最好的语言" + "%c https://vuejs.org/", "color:#fff;background:linear-gradient(90deg,#448bff,#44e9ff);padding:5px 0;", "color:#000;background:linear-gradient(90deg,#44e9ff,#ffffff);padding:5px 10px 5px 0px;");

            const area = await getLocation('area')
            this.area = area
            const city = await getLocation('city')
            this.city = city
            const province = await getLocation('province')
            this.province = province
            this._queryInfo('province', '北京市')
        },
        async _queryInfo(type, name) {
            this.cityname = name
            this.citytype = type
            const {data = []} = await queryInfo(type, name)
            this.$message(`${name}数据获取成功`);
            this.tableData = data
            this.handlexls({name:this.activeName})
        },
        handlexls(e){
            let len = this.tableData.length
            if(e.name ==='xls' && len){
                this.xlsurl = `${basexslURL}/${this.citytype}/${this.cityname}.xls`
                this.readWorkbookFromRemoteFile(this.xlsurl, function(workbook) {
                    console.log(workbook)
                    var sheetNames = workbook.SheetNames; // 工作表名称集合
                    var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
                    var csv = XLSX.utils.sheet_to_csv(worksheet);
                    document.getElementById('xlshtml').innerHTML = csv2table(csv);
                });
            }
            console.log(e.name,this.cityname)
        },
        // 从网络上读取某个excel文件，url必须同域，否则报错
         readWorkbookFromRemoteFile(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if(xhr.status == 200) {
                    var data = new Uint8Array(xhr.response)
                    var workbook = XLSX.read(data, {type: 'array'});
                    if(callback) callback(workbook);
                }
            };
            xhr.send();
        }
    }
})
