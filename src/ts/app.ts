import Greeter from './greeter';
import GreeterJa from './greeter-ja';
import DomConsole from './dom-console';

console.debug('app start');

const greeter = new Greeter("world");
const greeterJa = new GreeterJa("世界");
const domConsole = new DomConsole();

function resolveAfter2Seconds() {
  domConsole.log("starting slow promise");
  return new Promise<string>(resolve => {
    setTimeout(function() {
      resolve("slow")
      domConsole.log("slow promise is done");
    }, 2000)
  })
}

function resolveAfter1Second() {
  domConsole.log("starting fast promise");
  return new Promise<string>(resolve => {
    setTimeout(function() {
      resolve("fast")
      domConsole.log("fast promise is done");
    }, 1000)
  })
}

async function concurrentStart() {
  domConsole.log('==CONCURRENT START with await==');
  const slow = resolveAfter2Seconds() // 即時実行
  const fast = resolveAfter1Second() // 即時実行

  // 1. ここは即時実行される
  domConsole.log(await slow);// 2. ここは 1. の2秒後に実行される
  domConsole.log(await fast);// 3. ここは 1. の2秒後（2.の直後）に実行される
}


window.addEventListener("load", function() {
  // すべてが読み込まれた時に発火
  domConsole.element = document.getElementById('console');
  domConsole.log(greeter.greet());
  domConsole.log(greeterJa.greet());
  concurrentStart();
});
