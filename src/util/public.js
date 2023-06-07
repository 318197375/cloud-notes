import api from '@/api/public'

export const setNoteInfo = (res, vm) => {
  debugger
  if(res.data === null || res.data.length === 0) {
    vm.noMore = true;

  } else {
    vm.notes = vm.notes.concat(res.data)
    vm.page.pageNum += 1;
  }
}

export function beforeDrawerClose(done) {
  this.$confirm("确定要关闭编辑窗口吗？未保存的信息将丢失!", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    done();
  }).catch(() => {});
}

export const handleClose = (vm) => {
  vm.dialogVisible = false;
}

export function formatDate(value) {
  if (value) {
    const date = new Date(value);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

/**
 * 点击评论按钮显示输入框
 * item: 当前大评论
 * reply: 当前回复的评论
 */
export const showCommentInput = (item, leaf, vm) => {
debugger
  if (item != null) {
    vm.thisRoot = item.rootComment

    if (leaf != null) {
      // } else {
      //   this.inputComment = '@' + leaf.toUserName + ' '
      //
      vm.thisLeaf = leaf
    }
  }

  vm.showInput = true;
}

/**
 * 删除评论
 * */
export const deleteComment = (commentId, vm) => {
  vm.$confirm("确定要删除评论吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    debugger
    vm.addComment.commentId = commentId;
    api.删除评论(this.addComment)
      .then((res) => {
        vm.$message.success(res.message)
      })
      .catch((error) => {
        vm.$message.error(error.message)
      });
  }).catch(() => {});
}
