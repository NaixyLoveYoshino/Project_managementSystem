<template>
    <div class="charts" ref="charts"></div>
</template>


<script>
// 引入echarts
import * as echarts from "echarts";
export default {
    name: "progressChart",
    mounted() {
        // 当组件挂载完毕时,初始化echarts
        var lineChart = echarts.init(this.$refs.charts);
        // 配置数据
        lineChart.setOption({
            xAxis: {
                show: false,
                // 最小值最大值设置
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                // 均分
                type: "category",
            },
            // 系列
            series: [
                {
                    type: "bar",
                    data: [78],
                    color: "yellowgreen",
                    barWidth: 10,
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eee",
                    },
                    // label
                    label: {
                        show: true,
                        formatter: "|",
                        position: "right",
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