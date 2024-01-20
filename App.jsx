import React from "./core/React.js";

// let count = 10
// let props = { id: "11111111" }
// function Counter({ num }) {
//   function handleClick() {
//     console.log("click", count);
//     count++
//     props = {}
//     React.update()
//   }
//   return (
//     <div {...props}>count:{count}
//       <button onClick={handleClick}>click</button>
//     </div>
//   )
// }
// function CounterContainer() {
//   return <Counter></Counter>
// }

// function App() {
//   return (<div>A
//     <div>B
//       <div>D</div>
//       <Counter num={10} id='c1'></Counter>
//       {/* <Counter num={20} id='c2'></Counter> */}
//       {/* <CounterContainer></CounterContainer> */}
//       <div>F</div>
//     </div>
//     <div>C
//       <div>G</div>
//     </div>
//   </div>)
// }
let props = { id: "11111111" }
function Counter({ num }) {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState('bar')
  function handleClick() {
    setCount((c) => c + 1)
    setBar((s) => s + 'bar')
  }
  return (
    <div {...props}>count:{count}
      <button onClick={handleClick}>click</button>
      bar:{bar}
    </div>
  )
}
function CounterContainer() {
  return <Counter></Counter>
}

let countFoo = 1
function Foo() {
  console.log("foo rerun");
  const update = React.update()
  function handleClick() {
    countFoo++
    update()
  }
  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

let countBar = 1
function Bar() {
  console.log("bar rerun");
  const update = React.update()
  function handleClick() {
    countBar++
    update()
  }
  return (
    <div>
      <h1>bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

let countRoot = 1
function App() {
  console.log("app rerun")
  const update = React.update()
  function handleClick() {
    countRoot++
    update()
  }
  return (
    <div>
      {/* hi-mini-react count: {countRoot} */}
      <Counter></Counter>
      {/* <button onClick={handleClick}>click</button> */}
      {/* <Foo></Foo>
      <Bar></Bar> */}
    </div>
  )
}
export default App