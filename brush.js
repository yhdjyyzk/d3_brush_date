$(function () {
    console.log("exe");
    //日期的添加
    var year = ["2011", "2012", "2013", "2014", "2015", "2016"];
    var month = ["2015-01", "2015-02", "2015-03", "2015-04", "2015-05", "2015-06", "2015-07", "2015-08", "2015-09", "2015-10", "2015-11", "2015-12", "2016-01", "2016-02", "2015-03"];
    
    draw(year);

    $("#year").on("click", function () {
        draw(year);
    });

    $("#month").on("click", function () {
        draw(month);
    });

    function draw(date) {
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

            console.log(range);
        });
    }
});