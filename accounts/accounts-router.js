const express = require("express")

const db = require("../data/dbConfig")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const accounts = await db.select("*").from("accounts")
        res.json(accounts)
    }
    catch (err) {
        next(err)
    }

})


router.get("/:id", async (req, res, next) => {
    try {
        const [account] = await db
            .select("*")
            .from("accounts")
            .where("id", req.params.id)
            .limit(1)
        res.json(account)
    }
    catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        //be specific with a payload object what we are sending rather than sending whole data like "req.body"
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }
        if (!payload.name || !payload.budget) {
            return res.status(400).json({
                message: "Need a name or budget",
            })
        }
        //Insert into db(column) values(values)
        const [id] = await db.insert(payload).into("accounts")
        res.status(201).json(await getaccountid(id))
    }
    catch (err) {
        next(err)
    }
})

router.put("/:id",async(req,res,next)=>{
    try{
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }
        if (!payload.name || !payload.budget) {
            return res.status(400).json({
                message: "Need a name or budget",
            })
        }
       await db("accounts").where("id",req.params.id).update(payload)
       res.json(await getaccountid(req.params.id))
    }
    catch(err){
        next(err)
    }
    
})

router.delete("/:id",async (req,res,next)=>{
    try{
        await db("accounts").where("id",req.params.id).del()
        //after deleting no response so if we get 204 then its success
        res.status(204).end("success")

    }
    catch(err){
        next(err)
    }
})
function getaccountid(id) {
    return db.first("*") //shortcut to destructing a array and limit 1
        .from("accounts")
        .where("id", id)
}
module.exports = router