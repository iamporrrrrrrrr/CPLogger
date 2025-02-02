import express from "express"
import mongoose from "mongoose"
import cors from 'cors';
import cron from 'node-cron'
import problemRoutes from './routes/problems.js'
import { Problem } from "./models/problemModel.js"; 
import passport from "passport";
import authRoute from './routes/auth.js'
import './passport.js'
import session from "express-session";

const PORT = process.env.PORT
const mongoDBURL = process.env.mongoDBURL
const CLIENT_URL = process.env.CLIENT_URL
const SESSION_SECRET = process.env.SESSION_SECRET

let problemLists

const fetchProblems = async () => {
    try{
        console.log("fetched problems")
        const response = await fetch(`https://codeforces.com/api/problemset.problems`);
        problemLists = await response.json();
        problemLists = problemLists.result.problems
    }
    catch (err) {
        console.log("Error fetching problems")
    }
}

const authorize = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next()
}

const app = express()

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge:
        24*60*60*1000
     }
  }))
  

app.use(passport.initialize())

app.use(passport.session())

app.use(express.json())

// app.use(cors())

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

app.use('/auth', authRoute)

// app.get('/', (request,response) => {
//     console.log(request)
//     return response.status(200).send("Hello World")
// })

app.use(authorize)

  
app.post('/problems', async (request,response) => {
    try{
        if(!request.body.id){
            return response.status(400).json({message: 'Enter Problem ID'})
        }
        const selectedProblem = problemLists.find((problem) => `${problem.contestId}${problem.index}` === request.body.id)
        if(!selectedProblem)  return response.status(400).json({message: 'Problem not found'})
        // return response.status(201).send(selectedProblem)
        const newProblem = {
            id: request.body.id,
            name: selectedProblem.name,
            rating: (selectedProblem.rating ? selectedProblem.rating:0),
            tags: selectedProblem.tags,
            status: 0,
            userId: request.user.id
        }
        const problem = await Problem.create(newProblem)
        return response.status(201).json(problem)
    }
    catch (err) {
        console.log(err.message)
        response.status(500).json({message: err.message})
    }
})

app.get('/problems', async (request,response) => {
    try{
        const userId = request.user.id
        const problems = await Problem.find({userId: userId})
        return response.status(200).json(problems)
    }
    catch (err){
        console.log(err.message)
        return response.status(500).json({message: err.message})
    }
})


app.delete('/problems/:id', async (request,response) => {
    try{
        const { id } = request.params

        const userId = request.user.id

        if(!userId){
            return response.status(404).json({message: 'Unauthorized'})
        }

        const result = await Problem.findOneAndDelete({_id: id, userId})

        if(!result){
            return response.status(404).json({message: 'Problem not found'})
        }

        return response.status(200).json({message: 'Deleted successfully'})
    }
    catch (err) {
        console.log(err.message)
        return response.status(500).json({message: err.message})
    }
})

app.put('/problems/:id', async (request,response) => {
    try{
        const { id } = request.params
        const userId = request.user.id
        const result = await Problem.findOneAndUpdate({_id: id, userId}, request.body)

        if(!result) return response.status(404).json({message: 'Problem not found'})
        return response.status(200).json({message: "updated"})
    }
    catch (error){
        console.log(error.message)
        return response.status(500).json({message: error.message})
    }
})

app.get('/problems/random', async (request,response) => {
    try{
        const userId = request.user.id
        let minRating = parseInt(request.query.min_rating)
        if(isNaN(minRating)) minRating = 0
        let maxRating = parseInt(request.query.max_rating)
        if(isNaN(maxRating)) maxRating = Number.MAX_SAFE_INTEGER
        let problemTags = request.query.tags ? request.query.tags.split(',') : [];
        const solvedProblems = await Problem.find({userId})
        const unsolvedProblems = problemLists.filter((problem) => (!solvedProblems.includes(problem) &&typeof problem.rating !== 'undefined' && problem.rating >= minRating && problem.rating <= maxRating && problemTags.every(tag => problem.tags.includes(tag)) ))
        if(!unsolvedProblems.length) return response.status(404).json({message: 'Problem not found'})
        const randomProblem = unsolvedProblems[Math.floor(Math.random()*unsolvedProblems.length)]
        return response.status(200).json(randomProblem)
    }
    catch (err){
        console.log(err.message)
        return response.status(500).json({message: err.message})
    }
})

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
        fetchProblems()
        cron.schedule('*/5 * * * *', fetchProblems)
    })
    .catch((error => {
        console.log(error);
    }));


