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
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  }
  root = nextUnitOfWork
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
  console.log('initChildren', fiber)
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    updateProps(dom, fiber.props)
  }

  const children = fiber.props.children
  initChildren(fiber, children)
}

function perforUnitOfWork(fiber) {
  const isFuntionComponent = typeof fiber.type === 'function'
  if (isFuntionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
  // return fiber.parent?.sibling
}

let workId = 1
let nextUnitOfWork = null
let root = null
function workLoop(deadline) {
  workId++
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = perforUnitOfWork(nextUnitOfWork)
    // 剩余空闲时间
    shouldYield = deadline.timeRemaining() < 0
  }

  if (!nextUnitOfWork && root) {
    commitRoot()
  }
  // console.log('workId:' + workId, nextUnitOfWork)
  requestIdleCallback(workLoop)
}

function commitRoot() {
  console.log('commitRoot')
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
