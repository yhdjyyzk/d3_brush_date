$(function () {
    var data = [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 },
    ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。

    var da = [];
    data.forEach(function (d, i) {
        da.push(d["sold"]);
    });

    drawData(data);
    drawBrush(da.sort());

    function drawData(data) {
        d3.select("#c1").selectAll("*").remove();
        // Step 1: 创建 Chart 对象
        var chart = new G2.Chart({
            id: 'c1', // 指定图表容器 ID
            width: 800, // 指定图表宽度
            height: 400 // 指定图表高度
        });
        // Step 2: 载入数据源
        chart.source(data, {
            genre: {
                alias: '游戏种类' // 列定义，定义该属性显示的别名
            },
            sold: {
                alias: '销售量'
            }
        });
        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart.interval().position('genre*sold').color('genre')
        // Step 4: 渲染图表
        chart.render();
    }

    function drawBrush(date) {
        d3.select("#timePickerOuter").select("svg").remove();
        var dateWidth = 50 * date.length <= 600 ? 600 / date.length : 50; //刷选的时间宽度，若是时间的总长度小于容器的宽度，那么就会占满容器，否则返回最小宽度50
        var svg = d3.select('#timePickerOuter')
            .append('svg')
            .attr({
                "width": dateWidth * date.length,
                "height": $("#timePickerOuter").height() / 2
            })
            .append("g");

        var brushXScale = d3.scale.ordinal()
            .rangeRoundBands([0, dateWidth * date.length]);
        brushXScale.domain(date);

        var xAxis = d3.svg.axis().scale(brushXScale);
        //刷选器
        var brush = d3.svg.brush()
            .x(brushXScale)
            .extent([1, 2]);

        svg.append('g').call(xAxis);

        var timePickerSvg = d3.select("timePickerOuter").append("svg");
        var g = svg.append('g').attr("name", "brush");
        //绘制brush
        g.call(brush).call(brush.event);
        //调整拖选的范围、背景、按钮矩形等高度
        g.selectAll('rect').attr({
            "height": "30px",
        });

        //选择刷事件
        brush.on('brushend', function () {
            var e = brush.extent();
            var startPixel = e[0]; //获取刷选的范围
            var endPixel = e[1];

            var range = []; //时间范围
            date.forEach(function (d) {  //刷选范围转换为时间范围
                var coordinate = brushXScale(d) + brushXScale.rangeBand() / 2;
                if (coordinate >= startPixel && coordinate <= endPixel)
                    range.push(d);
            });

            var dtmp = [
                { genre: 'Sports', sold: 275 },
                { genre: 'Strategy', sold: 115 },
                { genre: 'Action', sold: 120 },
                { genre: 'Shooter', sold: 350 },
                { genre: 'Other', sold: 150 },
            ];

            var da = [];
            dtmp.forEach(function (d, i) {
                if (d["sold"] >= range[0] && d["sold"] <= range[range.length - 1])
                    da.push(d);
            });
            console.log(range);

            console.log(da);
            drawData(da);
        });
    }
});