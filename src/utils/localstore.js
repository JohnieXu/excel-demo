/**
 * Created by qufan on 2017/7/6.
 */
/**
 * 存储sessionStorage
 * @param name
 * @param content
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 * @param name
 */
export const getStore = name => {
  if (!name) return;
  let content = window.localStorage.getItem(name);
  if (content !== null) {
    try {
      return JSON.parse(content);
    } catch (e) {
      return content;
    }
  } else {
    return null;
  }
};

export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
