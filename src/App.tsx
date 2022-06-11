import { Component, createSignal } from 'solid-js';
import "./App.css";

type Todo = {
  status: "active" | "completed";
  content: string;
}

const TodoComponent: Component<{todo:Todo, changeStatus: (new_status: "active" | "completed") => void}> = (props) => {
  return (<div class={"todo"} classList={{"todo-completed": props.todo.status == "completed"}} onclick={() => props.changeStatus(props.todo.status == "active" ? "completed" : "active")}>{props.todo.content}</div>);
};

const App: Component = () => {
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [input, setInput] = createSignal("");

  const addTodo = (e: SubmitEvent) => {
    e.preventDefault();
    setTodos([...todos(), { content: input(), status: "active" }]);
    setInput("");
  };

  const changeStatus = (id: number, status: "active" | "completed") => {
    setTodos(todos().map((e, i) => i == id ? {...e, status: status} : e));
  };

  return (
  <div>
    <h1>TODO List</h1>
    <form onSubmit={addTodo}>
      <input required placeholder='ex) do my homework' value={input()} onInput={e => {setInput(e.currentTarget.value)}}/>
      <button>Add</button>
    </form>
    {todos().map((todo, i) => <TodoComponent todo={todo} changeStatus={(status) => changeStatus(i, status)}/>)}
  </div>
  );
};

export default App;
