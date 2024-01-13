import ReactDom from './core/ReactDom.js';
import App from './App';
console.log('mainJs');

ReactDom.createRoot(document.querySelector("#root")).render(App)