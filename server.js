const express = require('express');
const app = express();
const PORT = 3000;

const fs = require("fs");
const data = fs.readFileSync("heroList.json");
// HERO LIST
let heroList = JSON.parse(data);

app.use(express.json());
app.use(express.static("public"));

app.get("/api/heroes", (req, res) => {
    res.json(heroList);
})

// ADD NEW HERO TO LIST
app.post("/api/heroes", (req, res) => {

    let newId = 0;
    heroList.forEach((hero) => {
        // if hero name already exist then dont push to array
        if (hero.name === req.body.name) {
            res.status(400).json({
                Status:`${req.body.name} already exist in list, try another!`
            });
            throw new Error(`${req.body.name} already exist in list, try another!`);
        }

        if (hero.id > newId) {
            newId = hero.id
        }
    });
    newId++

    heroList.push({
        name: req.body.name,
        attribute: req.body.attribute,
        role: req.body.role,
        id: newId
    });

    const data = JSON.stringify(heroList, null, 2);
    fs.writeFile("heroList.json", data, (err) => {
        if (err) throw err;

        res.status(201).json({
            status: `${req.body.name} was added to the list!`
        });
    });
});
// FETCH SPECIFIC HERO BY ID
app.get("/api/heroes/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const specificHero = heroList.find((hero) => hero.id === id);
    res.json(specificHero);
});
// DELETE SPECIFIC HERO
app.delete("/api/heroes/:id", (req, res) => {
    const id = parseInt(req.params.id); 

    const specificHero = heroList.find((hero) => hero.id === id);
    heroList = heroList.filter((hero) => hero.id !== id);

    const data = JSON.stringify(heroList, null, 2);
    fs.writeFile("heroList.json", data, (err) => {
        if (err) throw err
        res.status(202).json({
            status: `${specificHero.name} was deleted from list!`
        })
    });
});
// UPDATE SPECIFIC HERO
app.put("/api/heroes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let specificHero = heroList.find((hero) => hero.id === id);

    if (heroList.includes(specificHero)) {
        specificHero.name = req.body.name;
        specificHero.attribute = req.body.attribute
        specificHero.role = req.body.role

        const data = JSON.stringify(heroList, null, 2);
        fs.writeFile("heroList.json", data, (err) => {
            if (err) throw err;
            res.status(200).json({
                status: "Hero was updated!"
            })
        });
    } else {
        res.status(400).json({
            status: "Hero doenst exist in list!"
        })
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});