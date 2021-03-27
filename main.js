// <i class="fas fa-times-circle"></i> 
// <i class="fas fa-times"></i>
// heart icon <i class="fas fa-heart"></i> fill
// heart icon <i class="far fa-heart"></i> empty

// Create application object
const superHeroApp={};

//API URL+KEY

superHeroApp.apiUrl = "https://superheroapi.com/api/";
superHeroApp.apiKey = "10224955387210311";


//create a method to request information form api

superHeroApp.getInformation = (input) => {

    const proxiedUrl = new URL(superHeroApp.apiUrl +  superHeroApp.apiKey +"/search/" + input);
  
    // console.log (proxiedUrl);
  
    const url = new URL("http://proxy.hackeryou.com");
    // console.log (url);
    // url.search = `${superHeroApp.apiKey}` + '/1'
    url.search = new URLSearchParams({
        reqUrl: proxiedUrl
    })

    fetch(url)
        .then( (response) =>{
            return response.json();
        })
        .then ((jsonResponse)=>{
            superHeroApp.dropDown(jsonResponse,input);
            // console.log(jsonResponse)
            // const ul = document.querySelector('ul')
            // const testElement = document.createElement('img');
            // testElement.src = jsonResponse.image.url;
            // ul.appendChild(testElement);
        })
}

//Function to use data from api and generate drop down menu elements and position them under search bar
superHeroApp.dropDown = (jsonResp,input) =>{
    const lowerCaseInput = input.toLowerCase();
    const jsonData = jsonResp;
    let unsortedNames = [];
    jsonData.results.forEach(character => {
        unsortedNames.push(character.name.toLowerCase());
    });
    // console.log(unsortedNames);
    const sortedNames = unsortedNames.filter(name => {
        // if (name[0] === lowerCaseInput) {
            // return true;
        // }
        // console.log(name.startsWith(lowerCaseInput));
        return name.startsWith(lowerCaseInput);

        
    })

    // console.log(sortedNames);
    const resultNames = [sortedNames[0],sortedNames[1], sortedNames[2]];
    const ul = document.querySelector(".dropDown");

    resultNames.forEach (name  => {
        // console.log(name);
        const listElement = document.createElement("li");
        listElement.textContent = name;
        // listElement.classList.add("dropDown");
        // console.log(listElement);
        ul.append(listElement);
    });

}

//event listener for text input
const textInput = document.querySelector("input[type=text]")
textInput.addEventListener("input", function(){
    superHeroApp.getInformation(textInput.value)
    // superHeroApp.getInformation(textInput.value);
});

//init method
superHeroApp.init = () =>{
    console.log("INTIALIZED!");
  
};

//call init method to start app
superHeroApp.init();

