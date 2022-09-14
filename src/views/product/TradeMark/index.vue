<template>
    <div>
        <!-- 按钮 -->
        <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin:0px 0px 10px 0px"
            @click="showDialog"
        >添加</el-button>
        <!-- 表格组件 -->
        <!-- 
            data:表格组件需要展示的数据
            border: 是否增加边框
            column属性
            label: 显示标题
            width: 对应列的宽度
            prop: 对应列内容的字段
        -->
        <!-- 
            注意: element当中table组件展示的数据是以列展示
        -->
        <el-table style="width: 100%" border :data="list">
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
            <el-table-column prop="prop" label="品牌Logo" width="width">
                <template slot-scope="{row}">
                    <img :src="row.logoUrl" alt style="width:100px;height:100px;" />
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row}">
                    <el-button
                        type="warning"
                        icon="el-icon-edit"
                        size="mini"
                        @click="updataTradeMark(row)"
                    >修改</el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteTradeMark(row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <!-- 当前第几页,数据总条数,每一页显示条数,连续页码书 -->
        <el-pagination
            style="margin-top:20px;text-align:center"
            :current-page="page"
            :total="total"
            :page-size="limit"
            :page-sizes="[3, 5, 10]"
            layout=" prev, pager, next, jumper, ->,sizes, total "
            @current-change="getPageList"
            @size-change="handleSizeChange"
        ></el-pagination>

        <!-- 
            对话框
            :visible.sync 控制对话框显示与隐藏
            Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
                并将 Form-Item 的 prop 属性设置为需校验的字段名即可。

        -->
        <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
            <!-- 展示表单元素 -->
            .1
            <!-- model属性:把表单数据收集到哪个对象身上,将来的表单验证,也需要这个属性 -->
            <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <!-- 此处收集图片数据不能使用v-model,因为并不是表单元素 -->
                <!-- 
                    action属性: 设置图片上传
                    on-success: 检测图片上传成功,成功后会执行一次
                    before-upload: 上传之前执行一次
                -->
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload
                        class="avatar-uploader"
                        action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdataTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "TradeMark",
    data() {
        return {
            // 当前分页器页数
            page: 1,
            // 每页展示的条数
            limit: 3,
            // 总共数据条数
            total: 0,
            // 列表展示数据
            list: [],
            // 对话框显示与隐藏的控制
            dialogFormVisible: false,
            // 弹出框加入图片
            imageUrl: "",
            // 收集品牌信息(对象身上的属性不能乱起名,要根据文档要求给后端返回响应的名字)
            tmForm: {
                tmName: "",
                logoUrl: "",
            },
            // 表单验证规则rules
            rules: {
                // 品牌名称的验证规则
                tmName: [
                    {
                        // required: 必须校验字段(前面的五角星)
                        // message: 提示信息
                        // trigger: 用户行为设置(什么时候触发)
                        required: true,
                        message: "请输入品牌名称",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 10,
                        message: "长度在 2 到 10 个字符",
                        trigger: "change",
                    },
                ],
                // 品牌logo验证规则
                logoUrl: [
                    {
                        required: true,
                        message: "请选择品牌图片",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    // 组件挂载完毕
    mounted() {
        // 获取列表数据的函数
        this.getPageList();
    },
    methods: {
        //获取品牌列表的数据
        async getPageList(pager = 1) {
            this.page = pager;
            //解构出参数
            const { page, limit } = this;
            //获取品牌列表的接口
            //当你向服务器发请求的时候，这个函数需要带参数，因此老师在data当中初始化两个字段，代表给服务器传递参数
            let result = await this.$API.trademark.reqTradeMarkList(
                page,
                limit
            );
            if (result.code == 200) {
                //分别是展示数据总条数与列表展示的数据
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },
        // 切换每页显示个数
        handleSizeChange(limit) {
            this.limit = limit;
            this.getPageList();
        },
        // 点击添加品牌按钮
        showDialog() {
            this.dialogFormVisible = true;
            // 清除数据
            this.tmForm = { tmName: "", logoUrl: "" };
        },
        // 修改某个品牌信息
        updataTradeMark(row) {
            // row: 当前用户选中的品牌信息
            this.dialogFormVisible = true;
            // 将已有的品牌信息赋值给tmForm
            // 此处的...是浅拷贝,目的就是使tmFOrm不立刻使用服务器返回的数组
            // 为的是防止:当用户修改时,点击"取消"依旧会修改品牌信息
            this.tmForm = { ...row };
        },
        // 上传图片相关的回调
        // 图片上传成功
        handleAvatarSuccess(res, file) {
            // console.log(res); res: 上传成功之后返回的前端数据
            // file: 上传成功之后服务器返回的前端数据
            // 收集品牌图片数据,因为将来需要带给服务器
            this.tmForm.logoUrl = res.data;
            // this.imageUrl = URL.createObjectURL(file.raw);
        },
        // 图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        // 添加按钮(添加/修改品牌信息)
        addOrUpdataTradeMark() {
            // 当所有字段验证通过以后再写业务逻辑
            this.$refs.ruleForm.validate(async (success) => {
                // 如果成功则触发回调
                if (success) {
                    this.dialogFormVisible = false;
                    let result =
                        await this.$API.trademark.reqAddOrUpdateTradeMark(
                            this.tmForm
                        );
                    if (result.code == 200) {
                        // 弹出信息(成功)
                        this.$message({
                            message: this.tmForm.id
                                ? "修改品牌成功"
                                : "添加品牌成功",
                            type: "success",
                        });
                        // 成功以后再次获取列表进行展示
                        // 如果是添加品牌.则停留在第一页,如果是修改品牌,则停留在当前页
                        this.getPageList(this.tmForm.id ? this.page : 1);
                    }
                } else {
                    console.log("error submit!!!");
                    return false;
                }
            });
        },
        // 删除品牌的信息
        deleteTradeMark(row) {
            this.$confirm(`你确定删除${row.tmName}吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    // 当用户点击确定按钮的时候触发
                    let result = await this.$API.trademark.reqDeleteTradeMark(
                        row.id
                    );
                    // 如果删除成功
                    if (result.code == 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        // 再次获取品牌列表数据
                        this.getPageList(
                            this.list.length ? this.page : this.page - 1
                        );
                    }
                })
                .catch(() => {
                    // 当用户点击取消按钮的时候触发
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
    },
};
</script>

<style >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>