<template>
    <div>
        <el-card style="margin:20px 0px">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <!-- 商品列表 -->
            <div v-show="isShowTable">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="!category3Id"
                    style="margin-bottom:10px"
                    @click="addAttr"
                >添加属性</el-button>
                <!-- 表格,展示平台属性 -->
                <el-table :data="attrList" style="width: 100%;" border>
                    <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150px" align="center"></el-table-column>
                    <el-table-column prop="prop" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag
                                type="success"
                                v-for="(attrValue) in row.attrValueList"
                                :key="attrValue.id"
                                style="margin:5px 10px"
                                :ref="$index"
                            >{{attrValue.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="150px" align="center">
                        <template slot-scope="{row,}">
                            <el-button
                                type="warning"
                                icon="el-icon-edit"
                                size="mini"
                                @click="updataAttr(row)"
                            ></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加/修改属性操作 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addAttrValue"
                    :disabled="!attrInfo.attrName"
                >添加属性值</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
                <el-table style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <el-input
                                v-model="row.valueName"
                                placeholder="请输入属性值名称"
                                size="mini"
                                v-if="row.flag"
                                @blur="toLook(row)"
                                @keyup.native.enter="toLook(row)"
                                :ref="$index"
                            ></el-input>
                            <span
                                v-else
                                @click="toEdit(row,$index)"
                                style="display: block"
                            >{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width" align="center">
                        <template slot-scope="{row,$index}">
                            <!-- 气泡确认框 -->
                            <el-popconfirm
                                :title="`确定删除 ${row.valueName} 吗?`"
                                @onConfirm="deleteAttrValue($index)"
                            >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    slot="reference"
                                ></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    @click="addOrUpdataAttr"
                    :disabled="this.attrInfo.attrValueList.length < 1"
                >保存</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
// 按需引入loadash
import _ from "lodash";
export default {
    name: "Attr",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            // 接收平台属性的数据
            attrList: [],
            // 控制table显示于隐藏
            isShowTable: true,
            // 收集新增|修改属性的属性名
            attrInfo: {
                attrName: "", //属性名
                attrValueList: [
                    //属性名中属性值，因为属性值可以是多个，因此需要的是数组
                ],
                categoryId: 0, //category3Id
                categoryLevel: 3,
            },
        };
    },
    methods: {
        // 自定义事件的回调
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                // 区分三级分类相应的id,以及父组件进行存储
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
            } else {
                this.category3Id = categoryId;
                // 发请求获取平台属性
                this.getAttrList();
            }
        },
        // 获取平台属性的数据的回调
        async getAttrList() {
            // 获取分类的id
            const { category1Id, category2Id, category3Id } = this;
            let result = await this.$API.attr.reqAttrList(
                category1Id,
                category2Id,
                category3Id
            );
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        // 添加属性值的回调
        addAttrValue() {
            // 向属性值数组添加元素
            this.attrInfo.attrValueList.push({
                // attrId:是相应的属性的Id,目前而言我们是添加属性操作,还没有响应的属性Id,所以先制为undefined
                // valueName: 相应的属性值的名称
                attrId: this.attrInfo.id, // 对于修改某个属性的时候,可以在已有的属性值的基础上新增新的属性值(新增属性值的时候,需要把以后的属性的id传入)
                valueName: "",
                flag: true, // flag: 给每一个属性值添加一个标记flag,使用户切换查看模式和编辑模式.好处: 每一个属性值可以控制自己的模式切换
                // 当前的flag属性是一个响应式属性(数据根据视图变化)
            });
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            });
        },
        // 添加属性按钮的回调
        addAttr() {
            // 切换显示于隐藏
            this.isShowTable = false;
            // 收集三级分类ID
            // 清除数据
            this.attrInfo = {
                attrName: "", //属性名
                attrValueList: [
                    //属性名中属性值，因为属性值可以是多个，因此需要的是数组
                ],
                categoryId: this.category3Id, //category3Id
                categoryLevel: 3,
            };
        },
        // 修改属性按钮的回调
        updataAttr(row) {
            this.isShowTable = false;
            // 将选中的属性赋值给attrInfo
            // 由于数据结构中存在对象里面嵌套数组,数组里又嵌套对象的结构,因此需要使用深拷贝
            this.attrInfo = _.cloneDeep(row);
            // 在修改某一个属性的时候,将相应的属性值元素加伤flag标记
            this.attrInfo.attrValueList.forEach((item) => {
                // 这样书写可以加flag字段,但是程序不会发生变化,因为此时的flag不是响应式字段
                // item.flag = false;
                // 第一个参数:对象  第二个参数:添加响应式属性  第三个参数: 添加属性的属性值
                this.$set(item, "flag", false);
            });
        },
        // 失去焦点的事件
        toLook(row) {
            if (row.valueName.trim() == "") {
                this.$message("请输入一个合法的属性值");
                return;
            }
            // 新增的属性值不能于已有的属性值重名
            let isRepat = this.attrInfo.attrValueList.some((item) => {
                // 需要将row从数组里面判断的时候清除
                if (row !== item) {
                    return row.valueName == item.valueName;
                }
            });
            if (isRepat) {
                this.$message("请勿添加相同的属性值");
                return;
            }
            row.flag = false;
        },
        // 点击span的回调,使其变成编辑模式
        toEdit(row, index) {
            row.flag = true;
            //获取input节点，实现自动聚焦
            //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
            //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
            //$nextTick,当节点渲染完毕了，会执行一次
            this.$nextTick(() => {
                //获取相应的input表单元素实现聚焦
                this.$refs[index].focus();
            });
        },
        // 气泡确认框确认按钮的回调
        deleteAttrValue(index) {
            this.attrInfo.attrValueList.splice(index, 1);
        },
        // 保存按钮:添加|修改属性操作
        async addOrUpdataAttr() {
            // 整理参数
            // 1:如果用户添加了很多属性值,切属性值为空的不应该提交给服务器
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
                (item) => {
                    // 过滤掉属性值不为空的
                    if (item.valueName !== "") {
                        // 删除掉flag属性
                        delete item.flag;
                        return true;
                    }
                }
            );
            try {
                // 发请求
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                this.$message({ type: "success", message: "保存成功" });
                this.getAttrList();
                this.isShowTable = true;
            } catch (error) {
                this.$message("保存失败");
            }
        },
        // 保存按钮是否可用
    },
};
</script>

<style>
</style>