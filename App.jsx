import React from "./core/React.js";

let count = 10
let props = { id: "11111111" }
function Counter({ num }) {
  function handleClick() {
    console.log("click", count);
    count++
    props = {}
    React.update()
  }
  return (
    <div {...props}>count:{count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function CounterContainer() {
  return <Counter></Counter>
}

function App() {
  return (<div>A
    <div>B
      <div>D</div>
      <Counter num={10} id='c1'></Counter>
      {/* <Counter num={20} id='c2'></Counter> */}
      {/* <CounterContainer></CounterContainer> */}
      <div>F</div>
    </div>
    <div>C
      <div>G</div>
    </div>
  </div>)
}
export default App