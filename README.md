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
