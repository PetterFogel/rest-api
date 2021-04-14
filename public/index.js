window.addEventListener("load", main);

const displayHeroesContainer = document.querySelector(".heroes-container");
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

        // Click on updateBtn to call updateSpecificHero function
        const updateBtn = document.createElement("button");
        updateBtn.innerText = "Update";
        updateBtn.classList.add("btn");
        heroContainer.appendChild(updateBtn)
        updateBtn.addEventListener("click", () => {
            fetchInputValuesFromUpdateForm(hero);
        });

        // Click on trashBtn to call deleteSpecificHero function
        const trashBtn = document.createElement("button");
        trashBtn.innerText = "Delete";
        trashBtn.classList.add("btn");
        heroContainer.appendChild(trashBtn);
        trashBtn.addEventListener("click", () => {
            deleteSpecificHero(hero.id);
        });

        // Click on div to call fetchSpecificHero
        heroContainer.addEventListener("click", () => {
            fetchSpecificHero(hero);
        });
    }
    console.log(heroes)
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

    
    // Click on updateBtn to call updateSpecificHero function
    const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";
    updateBtn.classList.add("btn");
    heroContainer.appendChild(updateBtn)
    updateBtn.addEventListener("click", () => {
        fetchInputValuesFromUpdateForm(hero);
    });

    // Click on trashBtn to call deleteSpecificHero function
    const trashBtn = document.createElement("button");
    trashBtn.innerText = "Delete";
    trashBtn.classList.add("btn");
    heroContainer.appendChild(trashBtn);
    trashBtn.addEventListener("click", (event) => {
        deleteSpecificHero(hero.id);
    });
}

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

    const inputValues = document.querySelectorAll(".update-form input");
    inputValues[0].value = specificHero.name
    inputValues[1].value = specificHero.attribute
    inputValues[2].value = specificHero.role

    const updateHeorBtn = document.getElementById("updateBtn");
    updateHeorBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const updatedName = inputValues[0].value;
        const updatedAttribute = inputValues[1].value;
        const updatedRole = inputValues[2].value;
        const id = specificHero.id;
        updateSpecificHero(updatedName, updatedAttribute, updatedRole, id)
        updateHeroContainer.style.display = "none";
    });

}

async function updateSpecificHero(name, attribute, role, id) {

    console.log(name, attribute, role, id)

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