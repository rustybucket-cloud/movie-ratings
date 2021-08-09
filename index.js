//use of import
import { fillSelect } from "./fillSelect.js";

const genreSelect = document.querySelector('#genres');
export const genres = ['Action','Adventure','Animation','Biography','Comedy','Crime','Documentary','Drama','Family','Fantasy','Film Noir','History','Horror','Musical','Mystery','Romance','Sci-Fi','Sport','Thriller','War','Western'];

document.addEventListener('DOMContentLoaded', fillSelect(genres, genreSelect));//loads the genres in the select

async function loadMovies() {//fetches movie data based on user input
    //use of const
    const genre = document.querySelector('#genres').value;
    const year = document.querySelector('#year').value;

    //use of let
    let search; //the variable that will be placed in the url in the fetch
    let objectResult; //where data is in a result

    tableDisplay('Loading Results');

    //conditional logic
    if (genre !== 'all' && year !=='') {//search by year and genre
        search = `byYear/${year}/byGen/${genre}`;
        objectResult = `Movies ${year}--${genre}`;
    }  
    else if (genre !== 'all' && year === '') {//search by genre
        search = `byGen/${genre}`;
        objectResult = `Movies ${genre}`;
    } 
    else if (genre === 'all' && year !== '') {//search by year
        search = `byYear/${year}`;
        objectResult = `Movies ${year}`;
    }
    else if (genre === 'all' && year === '') {//search by genre
        alert('Please search by genre or year.');
        return;
    }
    const movies = await fetchMovies(search);
    const length = movies[objectResult].length;
    if (length !== 0) {
        displayTable(movies[objectResult], year, length);
    }
    else {
        tableDisplay('No Results Found. Try Again.');
        //alert('Enter a valid year');
    }
}
document.querySelector('#submit').addEventListener('click',loadMovies);

//fetches data from https://rapidapi.com/SAdrian/api/data-imdb1/ and returns json
async function fetchMovies(search) {
    let moviesData = await fetch(`https://data-imdb1.p.rapidapi.com/movie/${search}/`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
		"x-rapidapi-host": "data-imdb1.p.rapidapi.com"
	}
    })
    let moviesJSON = await moviesData.json();
    return moviesJSON;
}

async function displayTable(movies, year, length) {
    const table = document.querySelector('#movie-table');
    table.innerHTML = '';
    const header = document.createElement('tr');
    const headerHTML = `
        <th>Title</th>
        <th>Release Year</th>
        <th>Content Rating</th>
        <th>Critical Rating</th>
    `;
    header.innerHTML = headerHTML;
    table.append(header);

    let numResults = document.querySelector('#numResults').value;
    if (numResults === 'all') {
        numResults = movies.length;
    }
    else {
        numResults = parseInt(numResults);
        if (length < numResults) {//if the number of movies is lower than numResults, numResults becomes equal to the number of movies
            numResults = length;
        }
    }
    for(let i=0; i < numResults; i++) {
        const imdbData = await fetch(`https://data-imdb1.p.rapidapi.com/movie/id/${movies[i].imdb_id}/`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
                "x-rapidapi-host": "data-imdb1.p.rapidapi.com"
            }
            }).catch(err => console.log(err));
        const imdbJSON = await imdbData.json();
        const movieStats = imdbJSON[movies[i].title];
        const row = document.createElement('tr');
        const rowHTML = `
            <td>${movies[i].title}</td>
            <td>${year}</td>
            <td>${movieStats.content_rating}</td>
            <td>${movieStats.rating}</td>
        `;
        row.innerHTML = rowHTML;
        row.id = movies[i].imdb_id;
        table.append(row);
    }

    table.classList.toggle('hidden');
    document.querySelector('#message').classList.add('hidden');
}

function tableDisplay(message) {//displays when no result is found
    document.querySelector('#movie-table').classList.add('hidden');
    const table = document.querySelector('#message');
    table.classList.remove('hidden');
    table.innerHTML = `<h1>${message}</h1>`;
}