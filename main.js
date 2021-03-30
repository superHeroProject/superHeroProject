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

superHeroApp.getInformation = (input,type) => {

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
                if (type === 'searchInput'){
                superHeroApp.dropDown(jsonResponse,input);
                }else{
                    superHeroApp.displayInformation(jsonResponse);
                }
            }
        })
}

    

    




//Function to use data from api and generate drop down menu elements and position them under search bar
superHeroApp.dropDown = (jsonResp,input) =>{
    const jsonData = jsonResp;
    const lowerCaseInput = input.toLowerCase();


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
        if (listElements[i].textContent === "" || listElements[i].textContent=== input) {
            listElements[i].classList.add("hidden");
        }
    }

}


//function to display picture and information when search form is submitted
superHeroApp.displayInformation = (jsonResp) =>{
    const jsonData= jsonResp;
    console.log(jsonData);
    const image = document.querySelector(".displayImage")

    image.src= jsonData.results[0].image.url;
    image.alt= `Image of ${jsonData.results[0].name}`;
    document.querySelector(".displayName").textContent = jsonData.results[0].name;
    document.querySelector(".displayAliases").textContent = document.querySelector(".displayAliases").textContent + jsonData.results[0].biography.aliases.join(', ');
    document.querySelector(".displayPlace").textContent = document.querySelector(".displayPlace").textContent + jsonData.results[0].biography["place-of-birth"];
    document.querySelector(".displayCombat").textContent = document.querySelector(".displayCombat").textContent + jsonData.results[0].powerstats.combat;
    document.querySelector(".displayDurability").textContent = document.querySelector(".displayDurability").textContent + jsonData.results[0].powerstats.durability;
    document.querySelector(".displayIntelligence").textContent = document.querySelector(".displayIntelligence").textContent + jsonData.results[0].powerstats.intelligence;
    document.querySelector(".displayPower").textContent = document.querySelector(".displayPower").textContent + jsonData.results[0].powerstats.power;
    document.querySelector(".displaySpeed").textContent = document.querySelector(".displaySpeed").textContent + jsonData.results[0].powerstats.speed;
    document.querySelector(".displayStrength").textContent = document.querySelector(".displayStrength").textContent + jsonData.results[0].powerstats.strength;
    document.querySelector(".displayGroup").textContent = document.querySelector(".displayGroup").textContent + jsonData.results[0].connections["group-affiliation"];

  
    
    
    
    


}



//event listener for text input
superHeroApp.textInput = document.querySelector("input[type=text]")
superHeroApp.textInput.addEventListener("input", function(){
    superHeroApp.getInformation(superHeroApp.textInput.value,"searchInput")
});

//event listener for dropdown click
superHeroApp.dropDownElements = document.querySelectorAll(".dropDownName");
superHeroApp.dropDownElements.forEach(menuItem =>menuItem.addEventListener ("click", function(){
    superHeroApp.textInput.value= menuItem.textContent;
    superHeroApp.getInformation(superHeroApp.textInput.value,"searchInput");
}))

//event listner for search submit
superHeroApp.searchSubmit = document.querySelector("input[type=submit]")

superHeroApp.searchSubmit.addEventListener("click",function(event){
    event.preventDefault();
    console.log('submitted');
    superHeroApp.getInformation(superHeroApp.textInput.value,"submit");
})




//init method
superHeroApp.init = () =>{
    document.querySelector("input[type=text]").value = "";
    console.log("INTIALIZED!");
};

//call init method to start app
superHeroApp.init();

