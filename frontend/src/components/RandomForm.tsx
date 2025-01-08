import React from "react"
import { IoClose } from "react-icons/io5"
import { useState } from "react"
import { CFProblem } from '../utils/interfaces.tsx'
import axios from "axios"

interface randomFormProps{
    setRandomProblem: React.Dispatch<React.SetStateAction<{ok: boolean, data: CFProblem}>>
}

interface randomProblemFilter{
    tags: string[],
    minRating: string,
    maxRating: string
}

const RandomForm = ({ setRandomProblem }: randomFormProps) => {
    const [randomProblemFilter, setRandomProblemFilter] = useState<randomProblemFilter>({ tags: [], minRating: '', maxRating: '' })
    const [selectedTag, setSelectedTag] = useState<string>('')
    const getRandomProblem = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        let queryString = 'http://localhost:5556/problems/random/?'
        if (randomProblemFilter.tags.length) queryString += `tags=${randomProblemFilter.tags.toString()}`
        if (!isNaN(parseInt(randomProblemFilter.minRating))) queryString += `&min_rating=${parseInt(randomProblemFilter.minRating)}`
        if (!isNaN(parseInt(randomProblemFilter.maxRating))) queryString += `&max_rating=${parseInt(randomProblemFilter.maxRating)}`
        axios
            .get(queryString, { withCredentials: true })
            .then((response) => {
                console.log('random problem fetched')
                setRandomProblem({ ok: true, data: response.data })
                setRandomProblemFilter({ tags: [], minRating: '', maxRating: '' })
                setSelectedTag("")
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <form onSubmit={(e) => getRandomProblem(e)} className="random-form">
            <div>Difficulty</div>
            <div className="form-rating">
                <input type='text' value={randomProblemFilter.minRating} onChange={e => setRandomProblemFilter({ ...randomProblemFilter, minRating: e.target.value })} />
                <hr />
                <input type='text' value={randomProblemFilter.maxRating} onChange={e => setRandomProblemFilter({ ...randomProblemFilter, maxRating: e.target.value })} />
            </div>
            <label htmlFor='tags'>Select tags</label>
            <select
                value={selectedTag}
                onChange={e => {
                    setRandomProblemFilter({ ...randomProblemFilter, tags: randomProblemFilter.tags.includes(e.target.value) ? randomProblemFilter.tags : [...randomProblemFilter.tags, e.target.value] })
                    setSelectedTag(e.target.value)
                }}>
                <option disabled value=""> -- select an option -- </option>
                <option value="2-sat"
                    title="2-satisfiability">2-sat</option>
                <option value="binary search"
                    title="Binary search">binary search</option>
                <option value="bitmasks"
                    title="Bitmasks">bitmasks</option>
                <option value="brute force"
                    title="Brute force">brute force</option>
                <option value="chinese remainder theorem"
                    title="Chinese remainder theorem">chinese remainder theorem</option>
                <option value="combinatorics"
                    title="Combinatorics">combinatorics</option>
                <option value="constructive algorithms"
                    title="Constructive algorithms">constructive algorithms</option>
                <option value="data structures"
                    title="Heaps, binary search trees, segment trees, hash tables, etc">data structures</option>
                <option value="dfs and similar"
                    title="Dfs and similar">dfs and similar</option>
                <option value="divide and conquer"
                    title="Divide and Conquer">divide and conquer</option>
                <option value="dp"
                    title="Dynamic programming">dp</option>
                <option value="dsu"
                    title="Disjoint set union">dsu</option>
                <option value="expression parsing"
                    title="Parsing expression grammar">expression parsing</option>
                <option value="fft"
                    title="Fast Fourier transform">fft</option>
                <option value="flows"
                    title="Graph network flows">flows</option>
                <option value="games"
                    title="Games, Sprague-Grundy theorem">games</option>
                <option value="geometry"
                    title="Geometry, computational geometry">geometry</option>
                <option value="graph matchings"
                    title="Graph matchings, König's theorem, vertex cover of bipartite graph">graph matchings</option>
                <option value="graphs"
                    title="Graphs">graphs</option>
                <option value="greedy"
                    title="Greedy algorithms">greedy</option>
                <option value="hashing"
                    title="Hashing, hashtables">hashing</option>
                <option value="implementation"
                    title="Implementation problems, programming technics, simulation">implementation</option>
                <option value="interactive"
                    title="Interactive problem">interactive</option>
                <option value="math"
                    title="Mathematics including integration, differential equations, etc">math</option>
                <option value="matrices"
                    title="Matrix multiplication, determinant, Cramer's rule, systems of linear equations">matrices</option>
                <option value="meet-in-the-middle"
                    title="Meet-in-the-middle">meet-in-the-middle</option>
                <option value="number theory"
                    title="Number theory: Euler function, GCD, divisibility, etc">number theory</option>
                <option value="probabilities"
                    title="Probabilities, expected values, statistics, random variables, etc">probabilities</option>
                <option value="schedules"
                    title="Scheduling Algorithms">schedules</option>
                <option value="shortest paths"
                    title="Shortest paths on weighted and unweighted graphs">shortest paths</option>
                <option value="sortings"
                    title="Sortings, orderings">sortings</option>
                <option value="string suffix structures"
                    title="Suffix arrays, suffix trees, suffix automatas, etc">string suffix structures</option>
                <option value="strings"
                    title="Prefix- and Z-functions, suffix structures, Knuth-Morris-Pratt algorithm, etc">strings</option>
                <option value="ternary search"
                    title="Ternary search">ternary search</option>
                <option value="trees"
                    title="Trees">trees</option>
                <option value="two pointers"
                    title="Two pointers">two pointers</option>
            </select>
            <div className="random-tag-container">
                {randomProblemFilter.tags.map((tag) => {
                    return <span onClick={() => {
                        setRandomProblemFilter({ ...randomProblemFilter, tags: randomProblemFilter.tags.filter((tagIn: string) => tagIn !== tag) })
                        setSelectedTag(randomProblemFilter.tags.length > 1 ? randomProblemFilter.tags[randomProblemFilter.tags.length - 2] : '')
                    }} className="random-tag">
                        {tag}<IoClose className='random-tag-delete'/></span>
                })}
            </div>

            <button>Random</button>
        </form>
    )
}

export default RandomForm