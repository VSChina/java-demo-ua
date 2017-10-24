var count;
var browser = {};
var os = {};

const optionTemplate = {
    backgroundColor: '#f6f6fa',
    title: {
        text: '',
        textStyle: {
            color: '#1a237e',
            fontSize: 30,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'bold'
        },
        top: 5,
        left: 10
    },
    tooltip: {},
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [{
        name: '签到来源',
        type: 'bar',
        data: [],
        itemStyle: {
            normal: {
                color: '#1a237e'
            },
            emphasis: {
                color: '#ffa800'
            }
        },
        label: {
            normal: {
                show: true,
                position: 'top',
                textStyle: {
                    color: "#1a237e"
                }
            },
            emphasis: {
                textStyle: {
                    color: "#ffa800"
                }
            }
        },
        barMaxWidth: 50
    }]
};

run();

function run() {
    console.log('run');
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
            $("#count").text(data.value.length);
            draw(data);
        })
        .always(function () {
            setTimeout(() => {
                run();
            }, 1000);
        });
}

function parseData(data) {
    browser = {};
    os = {};
    count = data.value.length;
    var parser = new UAParser();
    for (user of data.value) {
        parser.setUA(user.UA);
        var result = parser.getResult();
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

function draw() {
    drawChart(os, 'os-chart', "操作系统分布");
    drawChart(browser, 'browser-chart', "浏览器分布");
}

function drawChart(map, id, text) {
    var chartData = getChartData(map);

    var myChart = echarts.init(document.getElementById(id));

    var option = Object.assign({}, optionTemplate);
    option.title.text = text;
    option.xAxis.data = chartData.keys;
    option.series[0].data = chartData.data;

    myChart.setOption(option);
}

function getChartData(map) {
    var data = [];
    var keys = Object.keys(map).sort();

    for (key of keys) {
        data.push(map[key]);
    }

    return {
        data: data,
        keys: keys
    };
}