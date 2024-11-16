import './App.css';
import {useState, useEffect} from "react";
import man from "./man.png";

// EXAMPLE https://api.themoviedb.org/3/movie/550?api_key=c8190d104e34c4f62a2be88afa477327
// KEY c8190d104e34c4f62a2be88afa477327
// https://api.themoviedb.org/3/search/person?query=spielberg&api_key=c8190d104e34c4f62a2be88afa477327

function Actor({p}) {
  if (!p) {
    return <div>No person found</div>
  }

  var gender = "male";
  if (p.gender === 1) {
    gender = "female";
  }
  return (
    <div>
      <ImageFor extension = {p.profile_path}/>
      <h1>{p.name}</h1> 
      <p>Id: {p.id}</p> 
      <p>Gender: {gender}</p> 

    </div>
  )
}

function ImageFor(extension) {
  var url = "https://image.tmdb.org/t/p/w45";

  var imageUrl = (extension.extension) ? url + extension.extension : require('./man.png');

  return <img src={imageUrl}
              alt="No Image"/>

}

function KnownFor({ titles }) {
  if (titles && titles.length !== 0) {
    return (
      <div>
        <h2>Known For:</h2>
        {titles.map((t, i) => (
          <p>Movie {i+1}: {t.title}{t.name}</p>
        ))}
      </div>
    );
  }

  return <p>Known for no titles</p>

}

function Search(keyword) {
  const [persons, setPersons] = useState([]);
  let key = "c8190d104e34c4f62a2be88afa477327";
  let query = `https://api.themoviedb.org/3/search/person?query=${keyword}&api_key=${key}`;
  useEffect(() => {
      fetch(query)
      .then(res => res.json())
      .then(data => setPersons(data.results))
    }, []);

  return persons;
}

function SearchForm() {
  const [keyword, setKeyword] = useState("");
  return (
    <div>
      <form>
        
        <input name="search" value={keyword} placeholder='Search' onChange={e => setKeyword(e.target.value)}/>

        <button type='submit'>
          Search
          </button>
      </form>
    </div>

  )

  
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");
  const [index, setIndex] = useState(0);
  
  let persons;

  if (keyword) {
    persons = Search(keyword);
  }
  
  if (!persons || persons.length === 0) {
    return (<div>
              <SearchForm/>
            </div>)
  }

  const total = persons.length;

  return (
    <div>
      <div className={'searchBar'}>
        <SearchForm/>
        <hr/>
      </div>
      <div className='personPage'>
        <Actor p = {persons[index]}/>
        <KnownFor titles = {persons[index].known_for}/>
        <hr/>
      </div>
      <div className='searchButtons'>
        <p> Actors from keywords: {keyword}. Total actors from query = {total} </p>
        <p> Page: {index + 1} </p>
        <Buttons index={index} total={total} setIndex={setIndex}/>
      </div>
    </div>
  )
}

function Buttons({index, total, setIndex}) {
  const handleIndex = (i) => {
    setIndex(() => i);
  }
  

  

  return (<div>
          {Array.from({length : total}, (_, i) => (
            <button key = {i} onClick = {() => handleIndex(i)} disabled = {index === i}>
                {i + 1}
            </button>
          ))}
    </div>)
}


export default App;

/*

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");
  var persons;
  if (keyword) {
    persons = Search(keyword);
  }

  return (
    <div>
      <SearchForm/>
    {
      SearchResult(persons)
    }
    </div>
  );

  
function SearchResult(persons) {
  return (
  <div>
    <p>
        {persons.map((p) => Actor(p))}
    </p>
  </div>);
}

function SearchForm() {
  const [keyword, setKeyword] = useState("");
  return (
    <div>
      <form>
        
        Search for people: <input name="search" value={keyword} placeholder='Search' onChange={e => setKeyword(e.target.value)}/>

        <button type='submit'>
          Search
          </button>
      </form>
    </div>

  )

  
}

*/ 