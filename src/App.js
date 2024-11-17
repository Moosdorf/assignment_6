import './App.css';
import {useState, useEffect} from "react";

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
  return (// extra features to show?
    <div key={p.id}>
      <ImageFor extension = {p.profile_path}/> 
      <h1>{p.name }</h1> 
      <p>Popularity score: {p.popularity}</p> 
      <p>Gender: {gender}</p> 
    </div>
  )
}

function ImageFor(extension) {
  var url = "https://image.tmdb.org/t/p/w500";

  var imageUrl = (extension.extension) ? url + extension.extension : require('./man.png');
  return <img src={imageUrl}
              alt="No Image"/>

}
function SmallImageFor(extension) {
  var url = "https://image.tmdb.org/t/p/w500";

  var imageUrl = url + extension.extension;
  if (extension.extension) {
    return <img style={{width: 45, height: 68}} src={imageUrl}/>
  }

}

function KnownFor({ titles }) { // add images for titles
  if (titles && titles.length !== 0) {
    return (
      <div>
        <h2>Known For:</h2>
        {titles.map((t) => ( // extra features to show?
          <div>
            <h4><SmallImageFor extension = {t.poster_path}/> {t.title}{t.name} </h4>
            <p>Type: {t.media_type}. Released: {t.release_date}{t.first_air_date}</p>
            <p> {t.overview}</p>
            <hr/>
          </div>
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

function Buttons({index, total, setIndex}) { 
  // handle set index
  const handleIndex = (i) => {
    setIndex(() => i);
  }

  // declare arrays to store buttons
  var toRender = []; // all items to render

  // handle first button
  if (index > 2) {
    toRender.push(
      <span>
        <button key = {0} onClick = {() => handleIndex(0)} disabled = {index === 0}>
          1
        </button>
        ...
      </span>
    );
  }

  // handle middle buttons
  for (let i = index - 2; i < index + 3; i++) { // we want [n - 2, ..., n + 2] as long as we dont hit last or first index
    if (i >= 0 && i < total) {
      toRender.push(        
      <span>    
        <button key = {i} onClick = {() => handleIndex(i)} disabled = {index === i}>
          {i + 1}
        </button>
      </span>)
    }
  }



  // handle last button
  if (index < total - 3) {
    toRender.push(
    <span>
      ... 

      <button key = {total} onClick = {() => handleIndex(total-1)} disabled = {index === total-1}>
        {total}
      </button>
    </span>);
  }


    return <div>{toRender}</div>;
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");
  const [index, setIndex] = useState(0);
  
  let persons;

  if (keyword) {
    persons = Search(keyword);
  } else {
    persons = Search("Spiel"); // just a default search
  }
  
  if (!persons || persons.length === 0) {
    return (<div className={'searchBar'}>
              <SearchForm key = {keyword}/>
            </div>)
  }

  const total = persons.length;

  return (
    <div className='container'>

      <div className={'searchBar'}>
        <SearchForm/>
        <div className='searchButtons'>
          <p> Actors from keywords: {keyword}. Total actors from query = {total} </p>
          <p> Page: {index + 1} </p>
          <Buttons index={index} total={total} setIndex={setIndex}/>
          <hr/>
        </div>
      </div>

      <div className='personPage'>
        <div className='actor'>
          <Actor p = {persons[index]}/>
        </div>
      </div>
      <div className='knownFor'>
        <KnownFor className='titles' titles = {persons[index].known_for}/>
      </div>
    </div>
  )
}




// start app: cd desktop/ruc c sharp/assignment_6; npm start

export default App;
