import React from './core/React.js';

function Counter({num}) {
  return <div>count:{num}</div>
}
function CounterContainer() {
  return <Counter></Counter>
}

// const App = React.createElement("div", { id: "root" }, "hi-", "mini-react")
// const App = <div>hi-mini-react<p class="red">hello</p><p class="blue">world</p></div>
// const App = <div>hi-mini-react<div class="red">hello<p>,</p></div><div class="blue">world<p>!</p></div></div>
// const App = <div>A
//   <div>B
//     <div>D</div>
//     {/* <Counter></Counter> */}
//     <CounterContainer></CounterContainer>
//     <div>F</div>
//   </div>
//   <div>C
//     <div>G</div>
//   </div>
// </div>
function App() {
  return (<div>A
    <div>B
      <div>D</div>
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
      {/* <CounterContainer></CounterContainer> */}
      <div>F</div>
    </div>
    <div>C
      <div>G</div>
    </div>
  </div>)
}
export default App