const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5000

require('dotenv').config()

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m9s95.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send('this is car meachanik')
})

async function run() {
    try {
        await client.connect()

        const database = client.db("Feature");
        const serviceCollection = database.collection("service");

        // get api 
        app.get('/serveces', async (req, res) => {

            const data = serviceCollection.find({})

            const result = await data.toArray()
            res.send(result)


        })

        // dynamic api 
        app.get('/serveces/:id', async (req, res) => {
            const id = req.params.id
            const qury = { _id: ObjectId(id) }

            const result = await serviceCollection.findOne(qury)
            res.send(result)

        })

        // post api
        app.post('/serveces', async (req, res) => {

            const data = req.body
            const result = await serviceCollection.insertOne(data)
            console.log(result)
            res.json(result)
        })

        // delete api 
        app.delete('/serveces/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {
        // await client.close()
    }

}

run().catch(console.dir)







app.listen(port, () => {
    console.log('my port number is', port)
})