import { Accessor, Component, createEffect, createSignal, For, Index } from 'solid-js';
import "./App.css";

type Todo = {
  status: "active" | "completed";
  content: string;
}

const TodoComponent: Component<{todo:Todo, changeStatus: (new_status: "active" | "completed") => void, delete: () => void}> = (props) => {
  return (
  <div class={"todo"} classList={{"todo-completed": props.todo.status == "completed"}}>
      <div class="todo-delete" title="DELETE" onClick={e => props.delete()}></div>
      <div class="todo-content" onclick={() => props.changeStatus(props.todo.status == "active" ? "completed" : "active")}>{props.todo.content}</div>
  </div>);
};

const App: Component = () => {
  // get todos from localstorage
  const todosFromLocalstorage = localStorage.getItem("todos") == undefined ? null : localStorage.getItem("todos");
  const todosFromLocalstorageArray = todosFromLocalstorage && JSON.parse(todosFromLocalstorage);
  
  const [todos, setTodos] = createSignal<Todo[]>(todosFromLocalstorageArray || []);
  const [input, setInput] = createSignal("");

  const addTodo = (e: SubmitEvent) => {
    e.preventDefault();
    setTodos([...todos(), { content: input(), status: "active" }]);
    setInput("");
  };

  const changeStatus = (id: number, status: "active" | "completed") => {
    setTodos(todos().map((e, i) => i == id ? {...e, status: status} : e));
  };

  createEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos()));
  });

  return (
  <div>
    <h1>TODO List</h1>
    <form onSubmit={addTodo}>
      <input required placeholder='ex) do my homework' value={input()} onInput={e => {setInput(e.currentTarget.value)}}/>
      <button>Add</button>
    </form>
    <Index each={todos()}>
      {(todo: Accessor<Todo>, i: number) =>
        <TodoComponent todo={todo()} changeStatus={(status) => changeStatus(i, status)}
          delete={() => setTodos(todos().filter((_, j) => j!=i))}/>}
    </Index>
  </div>
  );
};

export default App;
