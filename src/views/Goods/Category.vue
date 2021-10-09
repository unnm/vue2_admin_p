<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="{ row }">
          <i
            class="el-icon-success"
            v-if="row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="{ row }">
          <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 属性用来指定级联选择器的数据源 -->
          <!-- props 属性用来指定级联选择器的配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <!-- 修改分类的表单 -->
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Category',
    data() {
      return {
        // 查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 商品分类数据列表，默认为空
        cateList: [],
        // 总数据条数
        total: 0,
        // 为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '400px'
          },
          {
            label: '是否有效',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前列使用的模板m名称
            template: 'isOk'
          },
          {
            label: '排序',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前列使用的模板m名称
            template: 'order'
          },
          {
            label: '操作',
            // 表示将当前列定义为模板列
            type: 'template',
            minWidth: '200px',
            // 表示当前列使用的模板m名称
            template: 'opt'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          cat_name: '', // 将要添加的分类名称
          cat_pid: 0, // 父级分类id
          cat_level: 0 // 分类的等级，默认要添加的是一级分类
        },
        // 添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ]
        },
        // 父级分类列表数据
        parentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_pid', // 指定选中的值
          label: 'cat_name', // 指定看到的值
          children: 'children' // 指定父子嵌套的属性
        },
        // 选中的父级分类的id数组
        selectedKeys: [],
        // 控制修改分类对话框的显示与隐藏
        editDialogVisible: false,
        // 修改分类的表单数据对象
        editCateForm: {
          cat_name: '', // 将要修改的分类名称
          cat_pid: '', // 父级分类id
          cat_id: '' // 当前分类id
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList() {
        const { type, pagenum, pagesize } = this.queryInfo
        const res = await this.$API.goods.reqGoodsCateList(
          type,
          pagenum,
          pagesize
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败！')
        }
        // 把数据列表赋值给cateList
        this.cateList = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听 pagenum 的改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 点击按钮，展示添加分类的对话框
      showAddCateDialog() {
        // 先获取父级分类数据列表
        this.getParentCateList()
        // 再展示出对话框
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      async getParentCateList() {
        const res = await this.$API.goods.reqGoodsCateList(2)
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级分类列表数据失败！')
        }
        this.parentCateList = res.data
      },
      // 级联选择器的选择项发生变化就触发这个函数
      parentCateChange() {
        // 如果 selectedKeys 数组中的 length 大于0，证明选中了父级分类
        // 反之，就说明没有选中父级分类
        if (this.selectedKeys.length > 0) {
          // 父级分类的id
          this.addCateForm.cat_pid =
            this.selectedKeys[this.selectedKeys.length - 1]
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          // 父级分类的id
          this.addCateForm.cat_pid = 0
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
      },
      // 点击按钮添加新的分类
      addCate() {
        this.$refs.addCateFormRef.validate(async (valid) => {
          if (!valid) {
            return this.$message.error('添加分类失败，请检查表单项！')
          }
          const { cat_pid, cat_name, cat_level } = this.addCateForm
          const res = await this.$API.goods.reqAddCate(
            cat_pid,
            cat_name,
            cat_level
          )
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      },
      // 监听添加分类对话框的关闭事件，重置表单数据
      addCateDialogClose() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      // 点击按钮，修改分类的回到函数
      async editCate(cate) {
        const res = await this.$API.goods.reqCateById(cate.cat_id)
        if (res.meta.status !== 200) {
          return this.$message.error('查询分类失败！请稍后尝试')
        }
        this.editCateForm.cat_name = res.data.cat_name
        this.editCateForm.cat_id = res.data.cat_id
        this.editDialogVisible = true
      },
      // 编辑提交分类
      async submitEditCate() {
        const { cat_id, cat_name } = this.editCateForm
        const res = await this.$API.goods.reqEditCate(cat_id, cat_name)
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败！')
        }
        this.$message.success('修改分类成功！')
        this.getCateList()
        this.editDialogVisible = false
      },
      // 删除分类的回调函数
      async deleteCate() {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch((err) => err)
        if (confirmResult === 'cancel') {
          this.$message.info('已取消删除！')
        } else if (confirmResult === 'confirm') {
          const res = await this.$API.goods.reqDeleteCate(
            this.editCateForm.cat_id
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除分类失败！')
          }
          this.$message.success('删除分类成功！')
          this.getCateList()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .tree-table {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>