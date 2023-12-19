export function updateProperties(oldVnode, newVnode) {
    const newProps = newVnode?.data?.props || {}; //新的vnode的属性
    const oldProps = oldVnode?.data?.props || {};
    const el = oldVnode.elm; // 真实节点
    console.log(el);
    // 如果新的节点没有 需要把老的节点属性移除
    for (const k in oldProps) {
      if (!newProps[k]) {
        el.removeAttribute(k);
      }
    }
    // 对style样式做特殊处理 如果新的没有 需要把老的style值置为空
    const newStyle = newProps.style || {};
    const oldStyle = oldProps.style || {};
    for (const key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = "";
      }
    }
    // 遍历新的属性 进行增加操作
    for (const key in newProps) {
      if (key === "style") {
        for (const styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === "class") {
        el.className = newProps.class;
      } else {
        // 给这个元素添加属性 值就是对应的值
        el.setAttribute(key, newProps[key]);
      }
    }
  }