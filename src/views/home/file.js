import axios from "axios";

/**
 * 获取网络文件buffer
 * @param {String} fileUrl 文件完整路径
 * @returns {Promise<Buffer>} data
 */
export const getFileBuffer = fileUrl => {
  return new Promise((resolve, reject) => {
    axios
      .get(fileUrl, {
        withCredentials: true,
        responseType: "arraybuffer",
        timeout: 1000 * 60 * 60
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};
