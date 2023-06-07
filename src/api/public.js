import axios from '@/axios'


export default {
  login(params) {
    return axios.post("user/login", params)
  },

  test() {
    return axios.get("user/test")
  },

  推荐文章 (params) {
    return  axios.post("note/", params)
  },

  获取用户信息 (id) {
    if (id) {
      return axios.get(`user/userInfo/?userId=${id}`)
    } else {
      return axios.get(`user/userInfo`)
    }
  },


  判断用户是否被注册 (name) {
      return axios.get(`user/userInfoByName/?userName=${name}`)
  },


  通过ID获取笔记信息 (param) {
    return axios.post(`note/getById`, param)
  },


  通过ID获取评论信息 (param) {
    return axios.post(`comment/getById`, param)
  },

  获取用户数据 (id) {
    if (id) {
      return axios.get(`user/userDate/?userId=${id}`)

    } else {
      return axios.get(`user/userDate`)
    }
  },

  判断是否是用户自身访问 (id) {
    if (id) {
      return axios.get(`user/isSelf/?userId=${id}`)
    } else {
      return axios.get(`user/isSelf`)
    }
  },

  获取指定用户的笔记基础信息 (param) {
    return axios.post("note/getBriefByUserId", param)
  },

  获取指定笔记的基础信息 (param) {
    return axios.post("note/getBrief", param)
  },

  修改用户信息 (param) {
    return axios.put("user/userInfo", param)
  },

  新建笔记 (param) {
    return axios.put("note/create", param)
  },

  保存笔记内容 (param) {
    return axios.put("note/updateDetail", param)
  },

  获取笔记内容 (param) {

    return axios.post("note/getDetail", param)
  },

  修改笔记基本信息 (param) {

    return axios.put("note/updateBrief", param)
  },

  逻辑删除笔记 (param) {
    return axios.put("note/delete", param)
  },

  获取根评论 (param) {
    return axios.post("comment/rootCommentGet", param)
  },

  获取子评论 (param) {
    return axios.post("comment/leafCommentGet", param)
  },

  删除评论 (param) {
    return axios.put("comment/commentDelete", param)
  },

  添加评论 (param) {

    return axios.put("comment/commentCreate", param)
  },

  点赞评论 (param) {

    return axios.put("comment/like", param)
  },
  点赞笔记 (param) {

    return axios.put("note/like", param)
  },

  取消点赞评论 (param) {

    return axios.put("comment/deleteLike", param)
  },

  取消点赞笔记 (param) {

    return axios.put("note/deleteLike", param)
  },

  获取用户消息_评论() {
    return axios.get("message/getCommentMessage")
  },

  获取用户消息_点赞() {
    return axios.get("message/getLikeMessage")
  },

  获取用户消息_系统消息() {
    return axios.get("message/getBulletinMessage")
  },

  获取用户消息_评论_已读(basePage) {
    return axios.post("message/getReadCommentMessage", basePage)
  },

  获取用户消息_点赞_已读(basePage) {
    return axios.post("message/getReadLikeMessage", basePage)
  },

  获取用户消息_系统消息_已读(basePage) {
    return axios.post("message/getReadBulletinMessage", basePage)
  },

  获取消息数量() {
    return axios.get("message/getMessageCounter")
  },


  获取收藏的笔记 (basePage) {
    return axios.post("collect/getNoteCollect", basePage)
  },

  获取收藏的评论 (basePage) {
    return axios.post("collect/getCommentCollect", basePage)
  },

  收藏(param) {
    return axios.put("collect/createCollect", param)
  },

  取消收藏(param) {
    return axios.put("collect/deleteCollect", param)
  },

  条件查询笔记(param) {
    return axios.post("note/getByCondition", param)
  },

  获取系统所有的API () {
    return axios.get("system/operateApi",)
  },

  将指定Api入库权限表(powerDTO) {
    return axios.put("system/operateApi", powerDTO)
  },

  指定Api从权限表删除(powerDTO) {
    return axios.put("system/operateApiDelete", powerDTO)
  },

  获取权限表中的所有数据() {
    return axios.get("system/operateTableApi")
  },

  获取所有的角色信息() {
    return axios.get("system/operateRole")
  },
  根据角色ID获取角色的权限信息(role) {
    return axios.post("system/operateRole", role)
  },

  新建角色(role) {
    return axios.put("system/operateRole", role)
  },

  将指定权限分配给角色(powerInfo) {
    return axios.put("system/configRole", powerInfo)
  },

  将指定角色的指定权限删除(powerInfo) {
    return axios.put("system/DeleteRolePower", powerInfo)
  },

  将指定角色删除(role) {
    return axios.put("system/operateDeleteRole", role)
  },

  发送注册验证码(userDTO) {
    return axios.post("system/sendRegisterCaptcha", userDTO)
  },

  发送找回密码验证码(userDTO) {

    return axios.post("system/sendRePwdCaptcha", userDTO)
  },

  用户注册(userInfo) {
    return axios.post("user/register", userInfo)
  },

  验证用户是否存在(userInfo) {
    return axios.post("user/verifyUserName", userInfo)
  },

  修改用户密码(userInfo) {
    return axios.put("user/updatePassword", userInfo)
  }
}

