function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'string' ? createTextNode(child) : child
      }),
    },
  }
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
  // console.log('el', el)
  //  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

  // console.log('el', el)
  // // id class
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== 'children') {
  //     dom[key] = el.props[key]
  //   }
  // })

  // const children = el.props.children
  // children.forEach((child) => {
  //   render(child, dom)
  // })
  // container.append(dom)
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}
function initChildren(fiber) {
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
    // if (child.props.children.length > 0) {
    //   initChildren(newFiber)
    // }
  })
}
function perforWorkOfUnit(fiber) {
  // 1. 创建 dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    fiber.parent.dom.append(dom)

    // 2. 处理 props
    updateProps(dom, fiber.props)
  }

  // 3. 转换链表 设置好指针
  initChildren(fiber)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  console.log('perforWorkOfUnit', fiber)
  return fiber.parent?.sibling
}
let workId = 1
let nextWorkOfUnit = null
function workLoop(deadline) {
  workId++
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = perforWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 0
  }
  // console.log('workId:' + workId, nextWorkOfUnit)
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
