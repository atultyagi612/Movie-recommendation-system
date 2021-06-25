let json_data=''
let suggestions
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        json_data = JSON.parse(this.responseText);
        suggestions = JSON.parse(json_data);
    }
};
xmlhttp.open("GET", "../Static/data.txt", true);
xmlhttp.send();

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;



inputBox.onkeyup = (e)=>{
    let userData = e.target.value; 
    let emptyArray = [];
    if(userData){
        emptyArray = suggestions.filter((data)=>{
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            return data = '<li type="submit" form="contact_form">'+ data +'</li>';
        });
        searchWrapper.classList.add("active"); 
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    searchWrapper.classList.remove("active");
    
    console.log(selectData)
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}










let lenght_item = 0
function loadDoc(data) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      console.log(this.responseText)
      if (this.readyState == 4 && this.status == 200) {
        out = JSON.parse(this.responseText)
        movie_detail_create()
        create_card()
      }
      else {
        console.log('error occur')
      }
    };
    xhttp.open("POST", "get_movies", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`id=${data}`);
}
var myForm = ""

function sub(e) {
  ouput_data = []
  e.preventDefault();
  console.log("Done")
  myForm = document.getElementById('contact_form');
  senddata(myForm.elements[0].value)
}

function senddata(dat) {
  let temp = dat.toString()
  loadDoc(temp)
}


// create movie details 
function movie_detail_create(){

    let temp=`<div class="main_heading">
    <h1 style="text-align: center;">${out.movie_info.name}</h1>
  </div>
  <div class="movie_detail" style="display: flex;">
    <div class="movie_image" style="    width: 80%;">
      <img style="    width: 80%;" src="https://image.tmdb.org/t/p/w500${out.movie_info.image}" alt="">
    </div>
    <div class="movie_few_info" style="display: flex; flex-direction: column; justify-content: space-evenly;">
      <h3>Overview:</h3>
      <h3>${out.movie_info.overview}</h3>

      <h3>Release date: ${out.movie_info.release_date}</h3>
      <h3>Runtime: ${out.movie_info.runtime} minutes</h3>
      <h3>Language: ${out.movie_info.original_language}</h3>
      <h3>Revenue: $${out.movie_info.revenue}</h3>
      <h3>status: ${out.movie_info.status}</h3>
    </div>
  </div>
  <div></div>`

  document.getElementsByClassName('main_movie')[0].innerHTML=temp
  searchWrapper.classList.remove("active");
}

function create_card(){
  let temp_data=''
  for( let i=0; i<out.rec_movies.name.length ; i++) {

    let temp=`<li class="card">
    <a class="card-image" onclick="senddata('${out.rec_movies.name[i]}')" style="background-image: url(${out.rec_movies.image[i]});">
    <img src="${out.rec_movies.image[i]}" alt="Psychopomp" />
    </a>
    <a class="card-description">
    <h2>${out.rec_movies.name[i]}</h2>
    </a>
    </li>`
    temp_data+=temp
  }
  document.getElementsByClassName('card-list')[0].innerHTML=temp_data
  window.scrollTo(0, 0);


}