// <i class="fas fa-times-circle"></i> 
// <i class="fas fa-times"></i>
// heart icon <i class="fas fa-heart"></i> fill
// heart icon <i class="far fa-heart"></i> empty

// Create application object
const superHeroApp={};
superHeroApp.team=[];


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
    superHeroApp.currentHero = jsonData.results[0];
    let doesContain = false;
    superHeroApp.team.forEach(teamMember =>{
        if (teamMember.name === superHeroApp.currentHero.name){
            superHeroApp.heart.classList.remove("far");
            superHeroApp.heart.classList.add("fas");
            doesContain = true;
        }
        if (doesContain === false){
            superHeroApp.heart.classList.remove("fas");
            superHeroApp.heart.classList.add("far");
        }
    })


    console.log(jsonData);
    const image = document.querySelector(".displayImage")
    const displayDiv = document.querySelector(".flexContainer")
    displayDiv.classList.remove("hiddenDiv");

    image.src= jsonData.results[0].image.url;
    image.alt= `Image of ${jsonData.results[0].name}`;
    document.querySelector(".displayName").textContent = jsonData.results[0].name;

    document.querySelector(".displayAliases span").textContent = document.querySelector(".displayAliases span").textContent = jsonData.results[0].biography.aliases.join(', ');
    document.querySelector(".displayPlace span").textContent = document.querySelector(".displayPlace span").textContent = jsonData.results[0].biography["place-of-birth"];
    document.querySelector(".displayCombat span").textContent = document.querySelector(".displayCombat span").textContent = jsonData.results[0].powerstats.combat;
    document.querySelector(".displayDurability span").textContent = document.querySelector(".displayDurability span").textContent = jsonData.results[0].powerstats.durability;
    document.querySelector(".displayIntelligence span").textContent = document.querySelector(".displayIntelligence span").textContent = jsonData.results[0].powerstats.intelligence;
    document.querySelector(".displayPower span").textContent = document.querySelector(".displayPower span").textContent = jsonData.results[0].powerstats.power;
    document.querySelector(".displaySpeed span").textContent = document.querySelector(".displaySpeed span").textContent = jsonData.results[0].powerstats.speed;
    document.querySelector(".displayStrength span").textContent = document.querySelector(".displayStrength span").textContent = jsonData.results[0].powerstats.strength;
    document.querySelector(".displayGroup span").textContent = document.querySelector(".displayGroup span").textContent = jsonData.results[0].connections["group-affiliation"];

}


//function for storing team data based on current hero
superHeroApp.storeTeam = (currentData) =>{
    superHeroApp.team.push(currentData);
}

//function for adding and displaying image of hero at the bottom of screen
superHeroApp.teamUl = document.querySelector(".team")

superHeroApp.displayTeam = () =>{
    superHeroApp.teamUl.innerHTML='';
    superHeroApp.team.forEach(teamMember =>{
        let liElement = document.createElement('li');
        let imageElement = document.createElement('img');
        let pElement = document.createElement('p');
        let iElement = document.createElement('i');
        iElement.classList.add("fas", "fa-times", "hidden")
        imageElement.src = teamMember.image.url;
        imageElement.alt= `Image of ${teamMember.name}`;
        pElement.textContent = teamMember.name;
        liElement.appendChild(iElement);
        liElement.appendChild(imageElement);
        liElement.appendChild(pElement);
        superHeroApp.teamUl.appendChild(liElement);

        iElement.addEventListener("click",function(){

            const tempName = this.nextSibling.nextSibling.textContent
            console.log(tempName);
            superHeroApp.team.splice((superHeroApp.team.findIndex(function(character){
                return character.name == tempName
            })),1)
            console.log(superHeroApp.team);
            if (superHeroApp.currentHero.name===tempName){
                superHeroApp.heart.classList.toggle("far");
                superHeroApp.heart.classList.toggle("fas");
            }
            
            superHeroApp.displayTeam();

        })

        liElement.addEventListener("mouseenter", function(){
            iElement.classList.remove("hidden");
        })
        liElement.addEventListener("mouseleave", function(){
            iElement.classList.add("hidden");
        })

        
    })
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



//event listener for adding heroes (clicking heart)

superHeroApp.heart= document.querySelector(".fa-heart");

superHeroApp.heart.addEventListener("click", function(){
    if (superHeroApp.heart.classList.contains("far")){
        superHeroApp.heart.classList.toggle("far");
        superHeroApp.heart.classList.toggle("fas");
        superHeroApp.storeTeam(superHeroApp.currentHero);
        superHeroApp.displayTeam();
    } else {
        superHeroApp.heart.classList.toggle("far");
        superHeroApp.heart.classList.toggle("fas");
        superHeroApp.team.splice((superHeroApp.team.findIndex(function(character){
            return character.name == superHeroApp.currentHero.name
        })))
        superHeroApp.displayTeam();


    }
// console.log(superHeroApp.team);
})





//init method
superHeroApp.init = () =>{
    document.querySelector("input[type=text]").value = "";
    console.log("INTIALIZED!");
};

//call init method to start app
superHeroApp.init();

