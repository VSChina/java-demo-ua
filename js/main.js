var count;
var browser = {};
var os = {};

$.ajax({
        method: "GET",
        url: "https://demo4java.table.core.windows.net/user?sv=2016-05-31&ss=bfqt&srt=sco&sp=rwdlacup&st=2017-10-19T07%3A29%3A00Z&se=2018-11-21T07%3A29%3A00Z&sig=q5Jt6J7Ny4qBW0YllLt%2BMtibBWIwS0fmhcNM%2FH%2BqDrY%3D",
        headers: {
            'Accept': 'application/json;odata=nometadata'
        }
    })
    .done(function (data) {
        console.log(data);
        parseData(data);
        draw(data)
    });

function parseData(data) {
    count = data.value.length;
    var parser = new UAParser();
    for (user of data.value) {
        parser.setUA(user.UA);
        var result = parser.getResult();
        console.log(result.browser.name);
        console.log(result.os.name);
        var browserName = result.browser.name ? result.browser.name : 'Unknown';
        var osName = result.os.name ? result.os.name : 'Unknown';
        addData(browser, browserName);
        addData(os, osName);
    }
}

function addData(map, name) {
    if (map[name]) {
        map[name]++;
    } else {
        map[name] = 1;
    }
}

function draw(data) {
    console.log(os);
    console.log(browser);
    
    var data = [];

    for (key in os) {
        //console.log(osData);
        data.push({
            value: os[key],
            name: key
        });
        
    }
    console.log(data)
    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(document.getElementById('main'));

    // specify chart configuration item and data
    var option = {
        title: {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Windows', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
}