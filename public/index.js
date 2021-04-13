window.addEventListener("load", main);

const displayHeroesContainer = document.querySelector(".heroes-container");
displayHeroesContainer.style.display = "none";

const addHeroContainer = document.querySelector(".add-hero-container")
addHeroContainer.style.display = "none";

const body = document.querySelector("body");
body.appendChild(displayHeroesContainer);

function main() {
    addEventListeners();

    // fetchAllHeroes();
    // fetchSpecificHero(2);
    // addNewHero("Axe", "Strength", "Tank");
    // deleteSpecificHero(4);
    // updateSpecificHero("Lion", "Intelligence", "Support", 2);
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
            displayHeroesContainer.innerHTML = "";
            fetchSpecificHero(hero);
        });
    }
    console.log(heroes)
}

async function fetchSpecificHero(specificHero) {
    const id = specificHero.id;
    const hero = await makeRequest("/api/heroes/" + id, "GET");

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

    // Click on trashBtn to call deleteSpecificHero function
    const trashBtn = document.createElement("button");
    trashBtn.innerText = "Delete";
    trashBtn.classList.add("btn");
    heroContainer.appendChild(trashBtn);
    trashBtn.addEventListener("click", () => {
        deleteSpecificHero(hero.id);
    });

    console.log(hero);
}

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const inputValues = document.querySelectorAll(".add-form input");
    const name = inputValues[0].value;
    const attribute = inputValues[1].value;
    const role = inputValues[2].value;
    addNewHero(name, attribute, role);
})

async function addNewHero(name, attribute, role) {
    const newHero = {
        name: name,
        attribute: attribute,
        role: role
    }

    console.log(newHero)

    const addHero = await makeRequest("/api/heroes/", "POST", newHero);
    console.log(addHero)
}

async function deleteSpecificHero(id) {
    const deletedHero = await makeRequest("/api/heroes/" + id, "DELETE");
    console.log(deletedHero);
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