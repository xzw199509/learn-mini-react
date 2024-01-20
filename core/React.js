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
  wipRoot = nextUnitOfWork
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
function updateProps(dom, nextProps, prevProps) {
  // (1)old有，new无，去删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // (2)old无，new有，去添加
  // (3)old有，new有，去修改
  Object.keys(nextProps).forEach((key) => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (/^on/.test(key)) {
          const eventType = key.substring(2).toLocaleLowerCase()
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }

    // if (/^on/.test(key)) {
    //   dom.addEventListener(key.substring(2).toLocaleLowerCase(), props[key])
    // } else if (key !== 'children') {
    //   dom[key] = props[key]
    // }
  })
}
function reconcileChildren(fiber, children) {
  // const children = fiber.props.children
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'update',
        alternate: oldFiber,
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement',
        }
      }

      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    if (newFiber) {
      prevChild = newFiber
    }
  })
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = []
  stateHookIndex = 0
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    updateProps(dom, fiber.props, {})
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
}

function performUnitOfWork(fiber) {
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
// work in progress
let wipRoot = null
let currentRoot = null
let deletions = []
let wipFiber = null

function workLoop(deadline) {
  workId++
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      // console.log('hit', wipRoot, nextUnitOfWork)
      nextUnitOfWork = undefined
    }
    // 剩余空闲时间
    shouldYield = deadline.timeRemaining() < 0
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  // console.log('workId:' + workId, nextUnitOfWork)
  requestIdleCallback(workLoop)
}

function commitRoot() {
  // console.log('commitRoot')
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}
requestIdleCallback(workLoop)

function update() {
  let currentFiber = wipFiber
  return () => {
    // console.log(currentFiber)
    // wipRoot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   alternate: currentRoot,
    // }
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextUnitOfWork = wipRoot
  }
}

let stateHooks = []
let stateHookIndex
function useState(initial) {

  let currentFiber = wipFiber
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : []
  }
  console.log('stateHook.queue.forEach');
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })
  stateHook.queue = []
  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks

  function setState(action) {

    const eagerState = typeof action === "function" ? action(stateHook.state) : action
    if (eagerState === stateHook.state) return
    stateHook.queue.push(typeof action === "function" ? action : () => action)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextUnitOfWork = wipRoot
  }
  return [stateHook.state, setState]
}

const React = {
  update,
  render,
  createElement,
  useState
}


export default React
