<template>

  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="width: 600px; margin: auto">

      <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="handleAvatarChange"
        :show-file-list="false"
      >
          <label for="avatar-input" class="note-avatar-label">
            <el-image :src="form.noteAvatar" class="avatar-image" :fit="`contain`"></el-image>
            <i class="el-icon-camera"></i>
          </label>
      </el-upload>


      <el-form-item label="文章标题" prop="noteTitle" style="margin-top: 20px">
        <el-input v-model="form.noteTitle"></el-input>
      </el-form-item>

      <el-form-item label="文章标签" prop="noteTag" >
        <el-tag
          :key="tag"
          v-for="tag in noteTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          size="medium"
        >
          {{tag}}
        </el-tag>

        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
      </el-form-item>

      <el-form-item label="可见性" prop="noteVisibility">
        <el-radio-group v-model="form.noteVisibility">
          <el-radio :label="12002" style="margin-right: 100px">公开</el-radio>
          <el-radio :label="12001" style="margin-right: 80px">私密</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="margin-right: 70px">
        <el-button type="primary" @click="submitForm(`form`)" >提交</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import api from '@/api/public'
import fileSave from '@/api/fileSave'

export default {
  data() {
    return {
      form: {
        noteAvatar: 'http://39.106.94.103/image/中北校徽3.png',
        noteTag: '[]',
        noteTitle: '',
        noteVisibility: 12001
      },
      noteTags: [],
      rules: {
        noteTag: [
          { required: true, message: '请输入文章标签', trigger: 'blur' }
        ],
        noteTitle: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        noteVisibility: [
          { required: true, message: '请选择可见性', trigger: 'change' }
        ]
      },

      inputVisible: false,
      inputValue: ''
    }
  },

  props: {
    note: {
      type: Object,
      required: true
    }
  },

  created () {
    this.changeForm(this.note);
  },

  watch: {
    async note (newNote, oldNote) {
      // this.$message.success(JSON.stringify(newNote))
      // 在这里进行对note变化的处理逻辑
      // 可以根据需要执行相应的操作，如刷新数据、重新加载内容等
      this.changeForm(newNote);
    }
  },

  methods: {
    changeForm(newNote) {
      this.noteTags = newNote.noteTag.split('=');

      this.form.noteId = newNote.noteId
      this.form.noteAvatar = newNote.noteAvatar
      this.form.noteTag = newNote.noteTag
      this.form.noteTitle = newNote.noteTitle
      this.form.noteVisibility = newNote.noteVisibility
    },

    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.form.noteTag = this.noteTags.join('=');
          await api.修改笔记基本信息(this.form)
            .then((res) => {
              this.$message.success(res.message)
              // 调用成功，抛出事件
              this.$nextTick(() => {
                // 在下一个 DOM 更新周期执行刷新操作
                window.location.reload();
              });
            })
            .catch((error) => {
              this.$message.error(error.message)
            })

          return true;
        } else {
          this.$message({
            message: '格式错误!',
            type: 'warning'
          })
        }
        return false
      })
    },

    handleAvatarChange(param) {
      let form = new FormData();
      form.append("image", param.file);

      fileSave.存储图片(form)
        .then((res) => {
          debugger

          this.$message.success(res.data)
          this.form.noteAvatar = res.data
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },

    handleClose(tag) {
      this.noteTags.splice(this.noteTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.noteTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>


<style>
.note-avatar-label{
  margin: auto;
  position: relative;
  display: inline-block;
  width: 200px;
  height: 120px;
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  border: 1px solid #409EFF;
}
.input-new-tag {
  width: 100px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
