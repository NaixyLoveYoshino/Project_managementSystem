<template>
    <div class="charts" ref="charts"></div>
</template>


<script>
// 引入echarts
import * as echarts from "echarts";
export default {
    name: "barChart",
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
                    type: "bar",
                    data: [43, 17, 33, 12, 79, 8, 36, 84, 52, 67, 12, 44, 88],
                    color: "cyan",
                },
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            tooltip: {},
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