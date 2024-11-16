import './App.css';
import {useState, useEffect} from "react";



function Greet({user}) {
  return <p>Hello {user}</p>
}

function Greeter({children, message}) {
  return (
    <div>
      <p>{message}:</p>
        {children}
    </div>
  )
}

function User({name, age}) {
  return <p>User {name} and is {age} years old</p>
}


function App({user}) {
  let users= [
    <User name="Bob"/>,
    <User name="Bobiline"/>
  ]
  let newusers = [
    "bob1", "bob2"
  ]
  let objectusers = [
    {name: "Bob", age: 24 },
    {name: "Mary", age: 8}
  ]

  const [number, setNumber] = useState(0);

  const [apiusers, setUsers] = useState([]);
  useEffect(() => {
    fetch("https://randomuser.me/api?results=5")
    .then(resp => resp.json())
    .then(data => setUsers(data.results))
  },
   []);

  if (user) {
    if (user === "Bob") {
      return <p>No access for bob</p>
    } else {
      return (
        <div>
          <h1>greet</h1>
          <Greeter  message="gg ">
            <Greet user="bob123by"/>
          </Greeter>

          <h1>display with map</h1>

          <p>users are:</p>
          {objectusers.map((u) => <User name = {u.name} age = {u.age}/>)}

          <h1>base calculation</h1>
          
          <p>gg {23 + 321}</p>

          <h1>buttons</h1>

          <p>number = {number}</p>
          <button onClick = {() => setNumber(n => n+1)}>
            increment number
          </button>
          <button onClick = {() => setNumber(n => n*2)}> 
            double number
          </button>
          <button onClick = {() => setNumber(n => n/2)}> 
            half the number
          </button>


          <h1>api users: {apiusers.length}</h1>
          {apiusers.map((u) => <p>{u.name.first}</p>)}

        </div>
      );
    }
  } else {
    return <p>NO user</p>
  }


}

export default App;