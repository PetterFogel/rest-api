window.addEventListener("load", main);

const displayHeroesContainer = document.querySelector(".heroes-list-container");
displayHeroesContainer.style.display = "none";

const addHeroContainer = document.querySelector(".add-hero-container");
addHeroContainer.style.display = "none";

const updateHeroContainer = document.querySelector(".update-hero-container");
updateHeroContainer.style.display = "none";

const body = document.querySelector("body");
body.appendChild(displayHeroesContainer);

function main() {
    addEventListeners();
}

function addEventListeners() {
    const displayHeroesBtn = document.getElementById("displayAllHeroes");
    displayHeroesBtn.addEventListener("click", () => {
        displayHeroesContainer.style.display = "block";
        addHeroContainer.style.display = "none";
        fetchAllHeroes();
    });

    const addHeroBtn = document.getElementById("addHeroToData");
    addHeroBtn.addEventListener("click", () => {
        displayHeroesContainer.style.display = "none";
        addHeroContainer.style.display = "block";
    })
}

async function fetchAllHeroes() {
    const heroes = await makeRequest("/api/heroes", "GET");
    displayHeroesContainer.innerHTML = "";
    updateHeroContainer.style.display = "none"

    for (const hero of heroes ) {
        // HERO HOLDER DIV
        const heroContainer = document.createElement("div");
        heroContainer.classList.add("hero-container")   
        displayHeroesContainer.appendChild(heroContainer)

        const title = document.createElement("h2");
        title.innerText = hero.name;
        heroContainer.appendChild(title);

        const attributes = document.createElement("p");
        attributes.innerText = hero.attribute;
        heroContainer.appendChild(attributes);

        const roles = document.createElement("p");
        roles.innerText = hero.role;
        heroContainer.appendChild(roles);

        const btnsDiv = document.createElement("div");
        heroContainer.appendChild(btnsDiv);

        // Click on updateBtn to call updateSpecificHero function
        const updateBtn = document.createElement("button");
        updateBtn.innerText = "Update";
        updateBtn.classList.add("btn");
        btnsDiv.appendChild(updateBtn)
        updateBtn.addEventListener("click", () => {
            fetchInputValuesFromUpdateForm(hero);
        });

        // Click on trashBtn to call deleteSpecificHero function
        const trashBtn = document.createElement("button");
        trashBtn.innerText = "Delete";
        trashBtn.classList.add("btn");
        btnsDiv.appendChild(trashBtn);
        trashBtn.addEventListener("click", () => {
            deleteSpecificHero(hero.id);
        });

        // Click on div to call fetchSpecificHero
        heroContainer.addEventListener("click", () => {
            fetchSpecificHero(hero);
            console.log(hero)
        });
    }
}

async function fetchSpecificHero(specificHero) {
    const id = specificHero.id;
    const hero = await makeRequest("/api/heroes/" + id, "GET");

    displayHeroesContainer.innerHTML = "";

    const heroContainer = document.createElement("div");
    heroContainer.classList.add("hero-container")   
    displayHeroesContainer.appendChild(heroContainer)

    const title = document.createElement("h2");
    title.innerText = hero.name;
    heroContainer.appendChild(title);

    const attributes = document.createElement("p");
    attributes.innerText = hero.attribute;
    heroContainer.appendChild(attributes);

    const roles = document.createElement("p");
    roles.innerText = hero.role;
    heroContainer.appendChild(roles);

    const btnsDiv = document.createElement("div");
    heroContainer.appendChild(btnsDiv);

    // Click on updateBtn to call updateSpecificHero function
    const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";
    updateBtn.classList.add("btn");
    btnsDiv.appendChild(updateBtn)
    updateBtn.addEventListener("click", () => {
        fetchInputValuesFromUpdateForm(hero);
        console.log(hero)
    });

    // Click on trashBtn to call deleteSpecificHero function
    const trashBtn = document.createElement("button");
    trashBtn.innerText = "Delete";
    trashBtn.classList.add("btn");
    btnsDiv.appendChild(trashBtn);
    trashBtn.addEventListener("click", (event) => {
        deleteSpecificHero(hero.id);
    });
}

// Add new hero from button
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const inputValues = document.querySelectorAll(".add-form input");
    const name = inputValues[0].value;
    const attribute = inputValues[1].value;
    const role = inputValues[2].value;
    addNewHero(name, attribute, role);
    inputValues[0].value = "";
    inputValues[1].value = "";
    inputValues[2].value = "";
})

async function addNewHero(name, attribute, role) {
    const newHero = {
        name: name,
        attribute: attribute,
        role: role
    }
    const addHero = await makeRequest("/api/heroes/", "POST", newHero);
}

async function deleteSpecificHero(id) {
    const deletedHero = await makeRequest("/api/heroes/" + id, "DELETE");
    console.log(deletedHero);
}

function fetchInputValuesFromUpdateForm(specificHero) {
    displayHeroesContainer.style.display = "none";
    updateHeroContainer.style.display = "block";

    const nameInput = document.getElementById("name-input");
    const attributeInput = document.getElementById("attribute-input");
    const roleInput = document.getElementById("role-input");
    
    nameInput.value = specificHero.name
    attributeInput.value = specificHero.attribute
    roleInput.value = specificHero.role
    
    const updateHeorBtn = document.getElementById("updateBtn");
    updateHeorBtn.addEventListener("click", () => {
        const updatedName = nameInput.value 
        const updatedAttribute = attributeInput.value
        const updatedRole = roleInput.value

        const id = specificHero.id;
        updateSpecificHero(updatedName, updatedAttribute, updatedRole, id)
        updateHeroContainer.style.display = "none";
    });

}

async function updateSpecificHero(name, attribute, role, id) {
    const updatedHero = {
        name: name,
        attribute: attribute,
        role: role
    }
    const update = await makeRequest("/api/heroes/" + id, "PUT", updatedHero);
    console.log(update);
}

async function makeRequest(url, method, body) {

    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })

    console.log(response)
    const result = await response.json();
    return result;
}