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

    const url = new URL("http://proxy.hackeryou.com");
    url.search = new URLSearchParams({
        reqUrl: proxiedUrl
    })

    fetch(url)
        .then( (response) =>{
            return response.json();
        })
        .then ((jsonResponse)=>{
            if (jsonResponse.response === "error"){
                const blankResult={
                    results: []
                };
                
                superHeroApp.dropDown(blankResult,input);
         
            }else {
                superHeroApp.dropDown(jsonResponse,input);
            }
        })
}

    

    




//Function to use data from api and generate drop down menu elements and position them under search bar
superHeroApp.dropDown = (jsonResp,input) =>{
    const lowerCaseInput = input.toLowerCase();
    const jsonData = jsonResp;
    console.log (jsonData);
    let unsortedNames = [];  




    jsonData.results.forEach(character => {
        unsortedNames.push(character.name.toLowerCase());
    });
    const sortedNames = unsortedNames.filter(name => {
        return name.startsWith(lowerCaseInput);
    })

    const resultNames = [sortedNames[0],sortedNames[1], sortedNames[2]];
    const listElements = document.querySelectorAll(".dropDownName");

    
        


    for (i = 0; i < resultNames.length; i++) {
        listElements[i].textContent = resultNames[i];
        listElements[i].classList.remove("hidden");
    }
    for (i = 0; i < 3 ; i++) {
        if (listElements[i].textContent === "") {
            listElements[i].classList.add("hidden");
        }
    }
}

//event listener for text input
const textInput = document.querySelector("input[type=text]")
textInput.addEventListener("input", function(){
    superHeroApp.getInformation(textInput.value)
    // superHeroApp.getInformation(textInput.value);
});

//init method
superHeroApp.init = () =>{
    document.querySelector("input[type=text]").value = "";
    console.log("INTIALIZED!");
  
};

//call init method to start app
superHeroApp.init();

