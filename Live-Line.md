# learn-mini-react
fiber
fc
nextUnitOfWork
root

1、render 创建工作单元

2、
requestIdleCallback(workLoop)
  => workLoop()

  => performUnitOfWork(fiber)
  对传入fiber.type进行判断是否为 function ,是则不创建dom元素，否则为创建dom

  => createDom(type)
  是否为 TEXT_ELEMENT，是则创建TextNode，否则创建Element
  => updateProps
  对props赋值，除了children 存储的是el 其他都为fc带入的参数 如id等
  => initChildren 
  转换链表 设置好指针
  => 构建下一个工作单元 从上往下构建虚拟dom树
  => 
  => 
  => 

  => commitRoot
  => commitWork
  // 递归便利fiber 构建dom树
  => commitWork