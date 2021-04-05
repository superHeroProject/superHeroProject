
// Create application object
const superHeroApp={};
//create team array
superHeroApp.team=[];


//API URL+KEY
superHeroApp.apiUrl = "https://superheroapi.com/api/";
superHeroApp.apiKey = "10224955387210311";


//create a method to request information from api
// Using juno's proxy to bypass CORS error
superHeroApp.getInformation = (input,type) => {

    const proxiedUrl = new URL(superHeroApp.apiUrl +  superHeroApp.apiKey +"/search/" + input);

    const url = new URL("https://proxy.hackeryou.com");
    url.search = new URLSearchParams({
        reqUrl: proxiedUrl
    })

    fetch(url)
        .then( (response) =>{
            return response.json();
        })
        //if api fetch is unsuccessful (e.g no results), then returns a blank object with a blank array
        .then ((jsonResponse)=>{
            if (jsonResponse.response === "error"){
                const blankResult={
                    results: []
                };
                superHeroApp.dropDown(blankResult,input);         
            }
            //if api fetch is successful, then either run dropdown function or display function with the obtained data
            else {
                if (type === 'searchInput'){
                superHeroApp.dropDown(jsonResponse,input);
                }else{
                    superHeroApp.displayInformation(jsonResponse);
                }
            }
        })
}


//This function uses data from api and generate drop down menu elements and position them under search bar
//jsonresp is the api data, and input is the user's input in the search bar
superHeroApp.dropDown = (jsonResp,input) =>{
    const jsonData = jsonResp;
    //convert input to lowercase
    const lowerCaseInput = input.toLowerCase();
    //placeholder array
    let unsortedNames = [];  

    //the jsonresponse is an object with a key called "results" that contains an array of characters(objects)
    //for each of these character objects, push the name of the character onto the placeholder array "unsorted names"
    //
    jsonData.results.forEach(character => {
        unsortedNames.push(character.name.toLowerCase());
    });
    //sortedNames is a filtered array that contains only names that start with the user's input
    const sortedNames = unsortedNames.filter(name => {
        return name.startsWith(lowerCaseInput);
    })

    //The dropdown will display the first 3 names and so this results array only contains 3 names
    const resultNames = [sortedNames[0],sortedNames[1], sortedNames[2]];
    //in the html there is an empty UL contained 3 empty li elements with the class of dropDownName. This variable will target elements with this class
    const listElements = document.querySelectorAll(".dropDownName");


    //This for loop as many times as there are names in the results array (so if there are only 2 results then it will only loop twice)
    //This loop replaces the text content of the li elements with the names from the results array and removes their hidden class (the hidden class in css has display:none);
    for (i = 0; i < resultNames.length; i++) {
        listElements[i].textContent = resultNames[i];
        listElements[i].classList.remove("hidden");
    }
    //this loop repeats 3 times regardless of length of the results array and adds the hidden class if the li is empty or exactly matches the input
    for (i = 0; i < 3 ; i++) {
        if (listElements[i].textContent === "" || listElements[i].textContent=== input) {
            listElements[i].classList.add("hidden");
        }
    }

}

//This function displays the image and information of a character, and it also changes the display state of the heart icon depending on if the character is on the team or not
superHeroApp.displayInformation = (jsonResp) =>{
    const jsonData= jsonResp;

    //this currenthero key and value is accessible outside of this function's scope
    superHeroApp.currentHero = jsonData.results[0];
    //this doescontain varible will be used to logic in the next block
    let doesContain = false;

    //This block of code checks if the the current hero selected is already on the team or not by iterating through each member of the team array and comparing to see if the name of the currently displayed hero is the same as the hero in iteration.
    superHeroApp.team.forEach(teamMember =>{
        //if the hero is in the team, then display a full heart
        if (teamMember.name === superHeroApp.currentHero.name){
            superHeroApp.heart.classList.remove("far");
            superHeroApp.heart.classList.add("fas");
            doesContain = true;
        }
        //if the hero is not on the team, then display an empty heart
        if (doesContain === false){
            superHeroApp.heart.classList.remove("fas");
            superHeroApp.heart.classList.add("far");
        }
    })

    //this variable points to image element for displaying
    const image = document.querySelector(".displayImage")
    //this variable points to the large container encompassing the displayed elements (image and text)
    const displayDiv = document.querySelector(".flexContainer")

    //unhide the element (it is hidden by default on initialization so that space is not taken prior to first search)
    displayDiv.classList.remove("hiddenDiv");

    //change source and alt of image
    image.src= jsonData.results[0].image.url;
    image.alt= `Image of ${jsonData.results[0].name}`;

    //display hero information as text by replacing text content.....
    document.querySelector(".displayName").textContent = jsonData.results[0].name;

    //TO DO: refactor this:
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


//this function is used to add a hero to the team by pushing their character object to an the team array
superHeroApp.storeTeam = (currentData) =>{
    superHeroApp.team.push(currentData);
}


superHeroApp.teamUl = document.querySelector(".team")
//function is used for adding and displaying the images of heroes at the bottom of screen in the team section
superHeroApp.displayTeam = () =>{
    //first wipe everything from the section
    superHeroApp.teamUl.innerHTML='';
    //for each team member.....
    superHeroApp.team.forEach(teamMember =>{
        //create elements
        let liElement = document.createElement('li');
        let imageElement = document.createElement('img');
        let pElement = document.createElement('p');
        //create X icon (this will appear on hover)
        let iElement = document.createElement('i')
        iElement.classList.add("fas", "fa-times", "hidden")
        //image source and alt are changed to the current iteration's member
        imageElement.src = teamMember.image.url;
        imageElement.alt= `Image of ${teamMember.name}`;
        //name is displayed by changing text content
        pElement.textContent = teamMember.name;
        //nest elements appropriately
        liElement.appendChild(iElement);
        liElement.appendChild(imageElement);
        liElement.appendChild(pElement);
        superHeroApp.teamUl.appendChild(liElement);
        
        //add an event listener to the X icon that will remove hero from the team when clicked
        iElement.addEventListener("click",function(){
            //this variable targets the display text of the character
            const tempName = this.nextSibling.nextSibling.textContent
            //this splice searches for the index of the team member's name and then removes it from the array 
            superHeroApp.team.splice((superHeroApp.team.findIndex(function(character){
                return character.name == tempName
            })),1)
            //if the current hero being displayed in the main section is the same as the one that was just removed from the team array, then change to empty heart icon
            if (superHeroApp.currentHero.name===tempName){
                superHeroApp.heart.classList.toggle("far");
                superHeroApp.heart.classList.toggle("fas");
            }
            //after removing from the team, rerun display team
            superHeroApp.displayTeam();
        })
        
        //adds an event listener on mouse enter that shows the X icon
        liElement.addEventListener("mouseenter", function(){
            iElement.classList.remove("hidden");
        })
        //adds an event listener on mouse leave that hides the X icon
        liElement.addEventListener("mouseleave", function(){
            iElement.classList.add("hidden");
        })
    })
}

//event listener for when user types into search bar
superHeroApp.textInput = document.querySelector("input[type=text]")
superHeroApp.textInput.addEventListener("input", function(){
    //this function gets api data, and displays as dropdown elements
    superHeroApp.getInformation(superHeroApp.textInput.value,"searchInput")
});

//event listener for when user clicks a dropdown menu item
superHeroApp.dropDownElements = document.querySelectorAll(".dropDownName");
//add an event listener to each dropdown menu item
superHeroApp.dropDownElements.forEach(menuItem =>menuItem.addEventListener ("click", function(){
    // when the dropdown menu item is clicked, run the same as if the user inputted that character's name with keyboard text
    superHeroApp.textInput.value= menuItem.textContent;
    superHeroApp.getInformation(superHeroApp.textInput.value,"searchInput");
}))

//event listener for when user clicks the search submit button
superHeroApp.searchSubmit = document.querySelector("input[type=submit]")
superHeroApp.searchSubmit.addEventListener("click",function(event){
    event.preventDefault();
    //this function takes the hero name currently in the search bar and will display information data if the hero exists
    superHeroApp.getInformation(superHeroApp.textInput.value,"submit");
})



//event listener for adding heroes (clicking heart)
superHeroApp.heart= document.querySelector(".fa-heart");

superHeroApp.heart.addEventListener("click", function(){
    //when the user clicks the heart......
    //if the heart is empty (character is not on team), change to a filled heart, then the add hero to team array and display updated team
    if (superHeroApp.heart.classList.contains("far")){
        superHeroApp.heart.classList.toggle("far");
        superHeroApp.heart.classList.toggle("fas");
        superHeroApp.storeTeam(superHeroApp.currentHero);
        superHeroApp.displayTeam();
    } else {
        //if the heart is full (character is on team), change to a empty heart, then the aremove hero from team and then display updated team
        superHeroApp.heart.classList.toggle("far");
        superHeroApp.heart.classList.toggle("fas");
        superHeroApp.team.splice((superHeroApp.team.findIndex(function(character){
            return character.name == superHeroApp.currentHero.name
        })))
        superHeroApp.displayTeam();
    }
})

//event listener for the information button
superHeroApp.infoBox= document.querySelector(".information");
superHeroApp.infoButton= document.querySelector(".fa-info-circle")
superHeroApp.infoButton.addEventListener("click",function(){
    //when the user clicks the info button, unhide the information box and recolor the information button
    superHeroApp.infoBox.classList.toggle("hidden");
    superHeroApp.infoButton.classList.toggle("selected");
    
})




//init method
superHeroApp.init = () =>{
    //empties the search bar (in case user refreshes page and previously had an input)
    document.querySelector("input[type=text]").value = "";
    //TO DO: put all event listener blocks of code into a setup function and call it here?
};

//call init method to start app
superHeroApp.init();

