# learn-mini-react

day 01
任务拆分
1、实现mini-react
  render方法实现对elemnt与文本内容展示
  了解可以利用vite对Jsx解析
2、添加单元测试
 测试createElement

day 02
requestIdleCallback 与 fiber
requestIdleCallback 利用浏览器空闲时间调用
fiber 使用单链表结构表示数据结构，定义对dom节点遍历方式
1.创建dom
2.处理props
3.转换链表 设置指针
4.返回下一个需要执行的任务


问题：
构造视频中的dom树无法展示
const App = <div>A
  <div>B
    <div>D</div>
    <div>F</div>
  </div>
  <div>C
    <div>G</div>
  </div>
</div>

day 03
1、实现统一提交
顶部节点为root.child root为next
fiber添加到dom
fiber.parent.dom.append(fiber.dom)
对子元素进行添加 child与sibling
对以上内容进行递归调用
以及对孩子节点判断是否包含内容
!fiber
顶部节点只添加一次在root添加后状态修改

2、实现functionComponent处理逻辑 简称fc
 （1）fc fiber.type() 返回的是 vdom
 （2）由于返回的是个element数据 children 为 element[] 需要套上处理成数组
 （3）fc 没有 vdom 属性得继续向上查找
 （4）fc 传参 fiber.props
 （5）之前只处理 child 为 string 类型  需要添加 number类型

问题：叔节点没有渲染
问题原因在返回 fiber.parent.sbiling 时，parent节点为div时，会没有兄弟节点，还需向上查找
处理方式查找父节点的兄弟节点时，没查找到继续向上查找


day 04
1、点击事件实现
点击事件 onClick ，在更新props时，在遍历中判断 key 是否为on开头 为dom添加对应的监听事件，挂上 props[key] 中对应的方法

2、更新props
update 使用最新的 nextUnitOfWork 更新 root
触发更新方法

在 performUnitOfWork 中，构造新旧fiber节点中对应关系

处理 diff props
(1)old有，new无，去删除
(2)old无，new有，去添加
(3)old有，new有，去修改

day 05 
1、diff 更新 children
2、删除 节点
（1）删除dom
（2）删除fc
关于如何处理dom与fc节点，如果fiber.dom 为空，进行递归传入 fiber.child 去移除dom

更新时填充deletions
commitRoot时，遍历deletions删除
处理完清空deletions

3、删除多余节点
问题：对于叶子节点被修改，叶子节点兄弟节点未被删除
处理方式：initChildren 中处理叶子节点的兄弟节点添加到deletions

4、解决 edge case 的方式
处理 child 为 false 的情况,不新建 newFiber;
以及不给prevChild 赋值 newFiber

5、减少重复计算
处理fc时 对传入的fiber进行存储
使用闭包包裹 update 中方法
还需重新理解

day 06 
useState
作用用于数据创建于赋值
数据更新方法中，给nextUnitOfWork赋值，commitRoot能够被触发

统一触发action
将 action 存入上一个fiber中，下次构建时一起处理

提前检测 减少更新
setState 时，判断action返回值是否与state值想同

day 07 useEffect
useEffect(()=>{
  console.log()
})
作用监听数据，数据改变时触发函数，传入为空，只会在初始化时调用
调用时机是在 React 完成对 DOM 的渲染之后，并且浏览器完成绘制之前

实现cleanup 清空副作用
调用时机是在所有effect之前