<template>
    <div class="charts" ref="charts"></div>
</template>


<script>
// 引入echarts
import * as echarts from "echarts";
export default {
    name: "lineChart",
    mounted() {
        // 当组件挂载完毕时,初始化echarts
        var lineChart = echarts.init(this.$refs.charts);
        // 配置数据
        lineChart.setOption({
            xAxis: {
                show: false,
                // boundaryGap: false,
                type: "category",
            },
            yAxis: {
                show: false,
            },
            // 系列
            series: [
                {
                    type: "line",
                    data: [43, 17, 33, 12, 79, 8, 36, 84, 52, 67, 12],
                    // 设置拐点的样式
                    itemStyle: {
                        opacity: 0,
                    },
                    // 显示平滑曲线
                    smooth: true,
                    // 线条的样式
                    lineStyle: {
                        color: "purple",
                    },
                    // 填充颜色设置
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "purple",
                                },
                                {
                                    offset: 1,
                                    color: "white",
                                },
                            ],
                            global: false,
                        },
                    },
                },
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
        });
    },
};
</script>

<style>
.charts {
    width: 100%;
    height: 100%;
}
</style>