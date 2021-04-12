window.addEventListener("load", main);

// Hero Holder DIV
const heroHolder = document.createElement("div");

function main() {
    fetchAllHeroes();
    // fetchSpecificHero(2);
    // addNewHero("Axe", "Strength", "Tank");
    // deleteSpecificHero(4);
    // updateSpecificHero("Lion", "Intelligence", "Support", 2);
}

async function fetchAllHeroes() {
    const heroes = await makeRequest("/heroes", "GET");

    for (const hero of heroes) {
        const names = document.createElement("h3");
        names.innerText = hero.name;

        const attributes = document.createElement("p");
        attributes.innerText = hero.attribute;

        const roles = document.createElement("p");
        roles.innerText = hero.role;

        heroHolder.appendChild(names)
        heroHolder.appendChild(attributes)
        heroHolder.appendChild(roles)
        const body = document.querySelector("body");
        body.appendChild(heroHolder)
    }
    console.log(heroes)
}

async function fetchSpecificHero(id) {
    const hero = await makeRequest("/heroes/" + id, "GET");
    console.log(hero);
}

async function addNewHero(name, attribute, role) {
    const newHero = {
        name: name,
        attribute: attribute,
        role: role
    }
    const addHero = await makeRequest("/heroes/", "POST", newHero);
    console.log(addHero);
}

async function deleteSpecificHero(id) {
    const deletedHero = await makeRequest("/heroes/" + id, "DELETE");
    console.log(deletedHero);
}

async function updateSpecificHero(name, attribute, role, id) {
    const updatedHero = {
        name: name,
        attribute: attribute,
        role: role
    }
    const update = await makeRequest("/heroes/" + id, "PUT", updatedHero);
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

    console.log(response);
    const result = await response.json();
    return result;
}