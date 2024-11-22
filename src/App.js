import './App.css';
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


// example api request of movie
// EXAMPLE https://api.themoviedb.org/3/movie/550?api_key=c8190d104e34c4f62a2be88afa477327

// our api key
// KEY c8190d104e34c4f62a2be88afa477327

// another example request, of a person this time
// https://api.themoviedb.org/3/search/person?query=spielberg&api_key=c8190d104e34c4f62a2be88afa477327


// define actor component
function Actor({p}) {
  if (!p) {
    return <div>No person found</div>
  }

  var gender = "male"; // by default set value to male
  if (p.gender === 1) { // if the gender value is 1, set to female
    gender = "female";
  }
  gender = FirstLetterUppercase(gender);
  return ( // we will display an image of the person, their name, as well as their popularity and gender
    <div className='personRight' key={p.id}>
      <ImageFor extension = {p.profile_path}/>
      <h1>{p.name}</h1> 
      <p>Popularity score: {p.popularity}</p> 
      <p>Department: {p.known_for_department}</p> 
      <p>Gender: {gender}</p> 
    </div>
  )
}

// image for is a function that takes an extension, which is obtained from a person profile or title profile
// example extension: "/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg"
function ImageFor({ extension }) { 
  var url = "https://image.tmdb.org/t/p/w500"; // w500 specifies the width of the image, 
                        // we use a large image to scale it down an retain the nice quality
                        // could add a parameter to specify this, we might need different sizes

  // the image url is a combination of the static url and the argument given.
  // if no image is available display a generic picture of a person 
  var imageUrl = (extension) ? url + extension : require('./man.png'); 
  var personStyle = (extension) ? {width: 300, height: 450} : {}; // set style based on picture chosen (default or not)
  return <img style={personStyle} src={imageUrl}
              alt="None"/>

}

// Obtain a smaller image, this is useful for known for movie posters.

function SmallImageFor({extension}) {
  var url = "https://image.tmdb.org/t/p/w500";

  var imageUrl = url + extension;
  if (extension) {
    return <img style={{width: 45, height: 68}} src={imageUrl} alt='None'/>
  }

}

var FirstLetterUppercase = (string) => { // make first letter uppercase. useful for "movie" and "tv".
  var firstChar = string[0].toUpperCase();
  return firstChar + string.slice(1); // slice removes all index below input (first letter in this case, index 0)
}

function KnownFor({ titles }) { // known for component (display all titles person is known for)
  if (titles && titles.length !== 0) { // the person must have titles otherwise we return a simple string in a p element
    return (
      <>
        <h2>Known For:</h2> 

        {titles.map((t) => ( // mapping each title to a div that contains an image, kind of media, release_Date and an overview 
          // using t.release_date and t.first_air_date, this is because if its a movie it has one, if tv then another. wont affect eachother
          <div> 
            <h4><SmallImageFor extension = {t.poster_path}/> {(t.title) ? t.title : t.name}</h4> 
            <p>Released: {(t.title) ? t.release_date : t.first_air_date}</p>
            <p>{FirstLetterUppercase(t.media_type)}.</p>
            <p>{t.overview}</p>
            <hr/>
          </div>
        ))} 
      </>
    );
  }

  return <p>Known for no titles</p>

}

// quick search function. given a keyword, fetch the persons from TMDB. We discard everything but the first page of persons
function Search(keyword) {
  const [persons, setPersons] = useState([]); // define an empty array with an updater
  let key = "c8190d104e34c4f62a2be88afa477327";
  let query = `https://api.themoviedb.org/3/search/person?query=${keyword}&api_key=${key}`;
  useEffect(() => { // fetch the data, then store in json, then using the updater input the result into persons
      fetch(query) 
      .then(res => res.json())
      .then(data => setPersons(data.results)) // we only take the result from page 1, so up to 20 people
                                              // we could get more results, but have limited our program to this.
    }, [query]);

  return persons; // and return the list of people
}

function SearchForm() { // basic search form, input and a search button that uses useState. set a keyword and update
                        // this searching is just extra practice. By default the site searches for spielberg hardcoded
  const [keyword, setKeyword] = useState("");
  return (
      <form className='searchForm'>
        
        <input className='search' name="search" value={keyword} placeholder='Search' onChange={e => setKeyword(e.target.value)}/>

        <button type='submit'>
          Search {/* submit the search. url will look like localhost:3000/search=something
                   we can fetch the search keyword later.*/
                  } 
          </button>
      </form>

  )

  
}

function Buttons({index, total, setIndex}) { 
  // handle set index
  const handleIndex = (i) => {
    setIndex(i);
  }

  // declare arrays to store buttons
  var toRender = []; // will store all items to render

  // handle left button
  if (index > 0) { 
    toRender.push(
      <button
        className="pageButton"
        onClick={() => handleIndex(index - 1)}
        disabled={index === 0}
      >
        &larr;
      </button>
    );
  }

  // handle first button
  // add the first button if index is larger than 2.
  // as we want N - 2 and N + 2, then we must remove the "first" button wehen the index is 2.
  if (index > 2) {
    toRender.push( // push the first button and string of ... to indicate there are buttons hidden
      <>
        <button className='pageButton' key = {0} onClick = {() => handleIndex(0)} disabled = {index === 0}>
          1
        </button>
        <span style={{paddingLeft: '10px', paddingRight: '10px' }}>...</span> 
      </>
    );
  }

  // handle middle buttons
  // adds the available buttons from [n - 2, ..., n + 2]
  for (let i = index - 2; i < index + 3; i++) { // we want [n - 2, ..., n + 2] as long as we dont hit last or first index
    if (i >= 0 && i < total) { // cant be larger or equal to total, and it cant be below minimum.
      toRender.push( // we must then push each button that fit
      <>    
        <button className={`pageButton ${index === i ? "active" : ""}`} key = {i} onClick = {() => handleIndex(i)} disabled = {index === i}>
          {i + 1}
        </button>
      </>)
    }
  }



  // handle last button
  if (index < total - 3) {
    toRender.push(
    <>
      <span style={{paddingLeft: '10px', paddingRight: '10px' }}>...</span> 
      <button className='pageButton' key = {total} onClick = {() => handleIndex(total-1)} disabled = {index === total-1}>
        {total}
      </button>
    </>);
  }

  // handle right button
  if (index < total - 1) {
    toRender.push(
      <button // Right button (&rarr; right arrow)
        className="pageButton"
        onClick = {() => handleIndex(index + 1)}
        disabled={index === total}
      >
        &rarr; 
      </button> 
    );
  }

    return <>{toRender}</>; // return everything, should match up with: button ... buttons ... button.
}

function App() {
  // paging
  const [index, setIndex] = useState(0); // paging initially set to 0

  // search keyword if any
  const params = new URLSearchParams(window.location.search); // if a search has been made, this object will contain it
  const keyword = params.get("search"); // try to get keyword out
  
  let persons; // define empty list of people to display
  let message = "Search for any person!";

  if (keyword) { // if a keyword has been entered we will search for it
    persons = Search(keyword);
  } else { 
    persons = Search("Spiel"); // else just a default search
  }
  
  if (!persons || persons.length === 0) { 
    if (keyword) {
      message = `No results found for: "${keyword}".`;
    }
    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <h1 className='introMessage'>{message}</h1>
            <hr/>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <SearchForm key = {keyword}/>
          </div>
        </div>
      </div>)
  }

  const total = persons.length;


  return ( // using bootstrap for the structure. We can specify how many grids something fills. e.g 'col-4' fills 4 grids, 
                                                                                          // and the other fills the rest
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <div className='searchForm'>
            <br/>
            <SearchForm/>
            <br/>
            <Buttons index={index} total={total} setIndex={setIndex}/>
            <hr/>
          </div>
        </div>
      </div>
      <div className='row'>
          <div className='col-4'>
            <Actor p = {persons[index]}/>
          </div>
          <div className='col'>
            <KnownFor className='titles' titles = {persons[index].known_for}/>
          </div>
      </div>
    </div>
  )
}

export default App;
