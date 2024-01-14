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