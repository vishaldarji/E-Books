let input = document.querySelector(".search");
let submit = document.querySelector(".submit");
let booksContainer = document.querySelector(".books");
let Loader = document.querySelector(".loading");
let ebooks= document.querySelector(".ebook");
// let loading = false; // Flag to prevent multiple simultaneous requests
var allData;
let startIdx = 0;




input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    booksContainer.innerHTML = "";
    fetchData(event.target.value)
  }
});

submit.addEventListener("click", () => {
  let searchTerm = input.value.trim();
  booksContainer.innerHTML = "";
  fetchData(searchTerm);
});

async function fetchData(searchTerm) {
  if(searchTerm === ""){
    alert("Please enter Book name");
    return;
  } 
   if(loading = true){
  Loader.style.visibility = "visible";
  ebooks.style.visibility = "hidden";
   }
  if (searchTerm != "") {
      // Fetch data from Open Library API
    let responce = await fetch(`https://openlibrary.org/search.json?title=${searchTerm}`)
    allData = await responce.json();
    allData = allData.docs
    allData = allData.filter((data) => {
      if (data.cover_i != undefined) {
        return data;
      }
      else {
        console.log(data.cover_i)
      }
    })
    // Display results
    displayResults();
    loading = false;
    Loader.style.visibility = "hidden";
    ebooks.style.visibility = "visible";
    // Enable loading for the next request
    
  }
}

function displayResults() {
  // let div = document.createElement("div");
  // div.className = "books";
  if (allData && allData.length > 0) {
    let data = allData.slice(startIdx , startIdx + 10);
    data.forEach((book) => {
      let bookElement = createBookElement(book);
      booksContainer.appendChild(bookElement);
    });
    // booksContainer.appendChild(div);
    startIdx = startIdx + 10;
  } else {
    booksContainer.innerHTML = "<p>No results found</p>";
  }
}

function createBookElement(book) {
  let bookDiv = document.createElement("div");
  bookDiv.className = "book";
  let authorName = document.createElement("h3");
  authorName.innerHTML = book.title;
  let imgElement = document.createElement("img");
  imgElement.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  imgElement.alt = book.title;
  bookDiv.appendChild(imgElement);
  bookDiv.appendChild(authorName);
  return bookDiv;
}

// Implement scroll-based pagination
window.addEventListener("scroll", () => {
  if (isBottom() && input.value.trim() != "") {
    displayResults()
    console.log(" Scroll pagination")
  }
});

function isBottom() {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}
