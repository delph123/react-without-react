import { createRoot, createSignal, h, onCleanup, render } from "./rwr";
import { AsyncApp, MyNameIs, NestedEffect } from "./examples/async_components";
import { MultiApp, GoodBye } from "./examples/components";
import { Counter, Todo } from "./examples/todo";

import "./style.css";

const exit = render(
  () => <Todo onexit={() => exit()} />,
  document.getElementById("app")!
);
