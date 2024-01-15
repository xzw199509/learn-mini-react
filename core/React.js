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
        const isTextNode = typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
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
  root = nextWorkOfUnit
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
function initChildren(fiber, children) {
  // const children = fiber.props.children
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
  })
}
function perforWorkOfUnit(fiber) {
  const isFuntionComponent = typeof fiber.type === "function"
  // if (isFuntionComponent) {
  //   console.log(fiber.type()); // 查看返回内容
  // }
  // 1. 创建 dom
  if (!isFuntionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))
      // fiber.parent.dom.append(dom)

      // 2. 处理 props
      updateProps(dom, fiber.props)
    }
  }

  // 3. 转换链表 设置好指针
  const children = isFuntionComponent ? [fiber.type(fiber.props)] : fiber.props.children
  initChildren(fiber, children)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  let nextFiber = fiber
  while (nextFiber) {
    if(nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
  // return fiber.parent?.sibling
}
let workId = 1
let nextWorkOfUnit = null
let root = null
function workLoop(deadline) {
  workId++
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = perforWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 0
  }

  if (!nextWorkOfUnit && root) {
    commitRoot()
  }
  // console.log('workId:' + workId, nextWorkOfUnit)
  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)

}


requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
