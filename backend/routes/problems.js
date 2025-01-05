import express from "express";
import { Problem } from "../models/problemModel.js";

const router = express.Router();

router.post('/', async (request,response) => {
    if(request.isAuthenticated())
    try{
        if(!request.body.id){
            return response.status(400).send({message: 'Enter Problem ID'})
        }
        const selectedProblem = problemLists.find((problem) => `${problem.contestId}${problem.index}` === request.body.id)
        // return response.status(201).send(selectedProblem)
        const newProblem = {
            id: request.body.id,
            name: selectedProblem.name,
            rating: (selectedProblem.rating ? selectedProblem.rating:0),
            tags: selectedProblem.tags,
            status: 0
        }
        const problem = await Problem.create(newProblem)
        return response.status(201).send(problem)
    }
    catch (err) {
        console.log(err.message)
        response.status(500).send({message: err.message})
    }
})

router.get('/', async (request,response) => {
    try{
        const problems = await Problem.find({})
        return response.status(200).json(problems)
    }
    catch (err){
        console.log(err.message)
        return response.status(500).send({message: err.message})
    }
})


router.delete('/:id', async (request,response) => {
    try{
        const { id } = request.params

        const result = await Problem.findByIdAndDelete(id)

        if(!result){
            return response.status(404).send({message: 'Problem not found'})
        }

        return response.status(200).send({message: 'Deleted successfully'})
    }
    catch (err) {
        console.log(err.message)
        return response.status(500).send({message: err.message})
    }
})

router.put('/:id', async (request,response) => {
    try{
        const { id } = request.params
        const result = await Problem.findByIdAndUpdate(id, request.body)

        if(!result) return response.status(404).send({message: 'Problem not found'})
        return response.status(200).send({message: "updated"})
    }
    catch (error){
        console.log(error.message)
        return response.status(500).send({message: error.message})
    }
})

export default router;