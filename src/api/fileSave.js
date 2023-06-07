import axios from '@/axios1'

export default {
  存储图片(form) {
    return axios.post("file/imageSave", form)
  }
}
