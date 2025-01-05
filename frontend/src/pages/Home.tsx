import { useState, useEffect } from 'react'
import axios from 'axios'
import RandomPopUp from '../components/RandomPopUp.tsx'
import { MdOutlineDelete } from 'react-icons/md'
import RandomForm from '../components/RandomForm.tsx'
import { IoStatsChart } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import { PieChart } from '@mui/x-charts'

function Home({ user }: any) {
    const [loading, setLoading] = useState<boolean>(false)
    const [problems, setProblems] = useState<any[]>([])
    const [newProblemId, setNewProblemId] = useState<string>("")
    const [randomProblem, setRandomProblem] = useState<any>({ ok: false, data: {} })
    const [showUnsolved, setShowUnsolved] = useState(false)
    const tagLists = ["2-sat",
        "binary search",
        "bitmasks",
        "brute force",
        "chinese remainder theorem",
        "combinatorics",
        "constructive algorithms",
        "data structures",
        "dfs and similar",
        "divide and conquer",
        "dp",
        "dsu",
        "expression parsing",
        "fft",
        "flows",
        "games",
        "geometry",
        "graph matchings",
        "graphs",
        "greedy",
        "hashing",
        "implementation",
        "interactive",
        "math",
        "matrices",
        "meet-in-the-middle",
        "number theory",
        "probabilities",
        "schedules",
        "shortest paths",
        "sortings",
        "string suffix structures",
        "strings",
        "ternary search",
        "trees",
        "two pointers"]
    const [tagStats, setTagStats] = useState<any>(tagLists.map((tag, index) => ({ id: index, label: tag, value: 0 })))
    const problemStatus = ['Unsolved', 'Solved', 'Understood']
    const statusColor = ['#ff4019','#67FFE7','#FFD300']

    const fetchProblems = (): void => {
        setLoading(true)
        axios
            .get('http://localhost:5556/problems/', { withCredentials: true })
            .then((response) => {
                setProblems(response.data.reverse())
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }


    const addProblem = (problemId: string): void => {
        axios
            .post('http://localhost:5556/problems/', { id: problemId }, { withCredentials: true })
            .then((_) => {
                console.log('problem added!')
                fetchProblems()
            })
            .catch((error) => {
                console.log(error)
            })
    }



    const deleteProblem = (id: string): void => {
        axios
            .delete(`http://localhost:5556/problems/${id}`, { withCredentials: true })
            .then((_) => {
                console.log('deleted')
                fetchProblems()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const updateStatus = (problem: any): void => {
        const { _id, status } = problem
        axios
            .put(`http://localhost:5556/problems/${_id}`, { status: (status + 1) % 3 }, { withCredentials: true })
            .then((_) => {
                console.log('updated')
                fetchProblems()
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        addProblem(newProblemId)
        setNewProblemId('')
    }

    const logout = (): void => {
        window.open("http://localhost:5556/auth/logout", "_self")
    }

    useEffect(() => {
        fetchProblems()
    }, [])

    useEffect(() => {
        setTagStats(tagLists.map((tag, index) => ({ id: index, label: tag, value: 0 })))
        // problems.filter(problem => problem.status == 1)
        //   .forEach(problem => {
        //     setTagStats(tagStats.map((tag: any) => ({...tag, value: tag.value+(problem.tags.includes(tag.label))})))
        //   })
        setTagStats(tagStats.map((tagStat: any) => {
            const count = problems.filter(problem => (problem.status === 1 || problem.status === 2) && problem.tags.includes(tagStat.label)).length
            return { ...tagStat, value: count }
        }))
    }, [problems])

    const getRatingColor = (rating :number): string =>{
        if(rating >=2400 ) return 'red'
        else if(rating >=2200) return 'rgb(255, 140, 0)';
        else if(rating >= 1900) return 'rgb(170, 0, 170)'
        else if(rating >= 1600) return 'blue'
        else if(rating >= 1400) return 'rgb(3, 168, 158)'
        else if(rating >= 1200) return 'rgb(0, 128, 0)'
        else return 'rgb(128, 128, 128)'
    }


    return (
        <>
            <div className="header">
                <div className="header-name"><span>CP</span>Logger</div>
                <div className="header-user">
                    <img src={user.photos[0].value} />
                    <div>{user.displayName}</div>
                    <div onClick={logout} className='logout'>Logout</div>
                </div>
            </div>
            <div className="body">
                <div className="body-main">
                    <div className="body-main-top">
                        <form onSubmit={(e) => handleSubmit(e)} className='problem-form'>
                                    <label htmlFor='id'>Problem ID</label>
                                    <input type='text' id='id' value={newProblemId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProblemId(e.target.value)} />
                                    <button>Add</button>
                        </form>
                        <div>
                            Show Unsolved
                            <div className='toggle-container' onClick={() => setShowUnsolved(!showUnsolved)}>
                                <div className='toggle' style={showUnsolved? {marginRight: 0, marginLeft: 'auto'}:{}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="table-container">
                    {loading ? 'loading' :
                        (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Problem ID</th>
                                        <th>Name</th>
                                        <th>Rating</th>
                                        <th>Tags</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.filter((problem => showUnsolved ? !problem.status : true)).map((problem, index) => {
                                        return (
                                            <tr key={`problem-${index}`}>
                                                <td>{problem.id}</td>
                                                <td onClick={()=> window.open(`https://codeforces.com/problemset/problem/${parseInt(problem.id)}/${problem.id.slice(parseInt(problem.id).toString().length)}`, "_blank") } className='problem-link'>{problem.name}</td>
                                                <td style={problem.rating? {color: getRatingColor(problem.rating)}:{}}>{problem.rating ? problem.rating : '-'}</td>
                                                <td className='problem-tags'>{problem.tags.map((tag: string, index2: any) => {
                                                    return (
                                                        <span className='problem-tag' key={`tag-${index}-${index2}`}>{tag}</span>
                                                    )
                                                })}</td>
                                                <td onClick={() => updateStatus(problem)} ><span className='problem-status' style={{color: statusColor[problem.status], outline: `2px solid ${statusColor[problem.status]}`}}>{problemStatus[problem.status]}</span></td>
                                                <td>
                                                    <button onClick={() => deleteProblem(problem._id) } className='delete-button'><MdOutlineDelete className='delete-icon'/></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                </div>
                </div>
                <div className="body-side">
                    <div className="chart">
                        <div className="chart-header"><IoStatsChart /> Problem Stats</div>
                        <hr className='side-hr'/>
                        <div className="chart-container">
                            <PieChart
                                series={[
                                    {
                                        data: tagStats.sort((a: any, b: any) => b.value - a.value),
                                        innerRadius: 30,
                                        outerRadius: 100,
                                        cx: '82%',
                                        cy: '50%'
                                    },
                                ]}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                                width={250}
                                height={250}
                                className='pie-chart'
                            />
                        </div>

                    </div>
                    <div className="random">
                        <div className="random-header"><FaRegQuestionCircle />Random Problem</div>
                        <hr className='side-hr'/>
                        <div className="random-form-container">
                            <RandomForm setRandomProblem={setRandomProblem} />
                        </div>
                    </div>
                </div>
            </div>
            {randomProblem.ok && randomProblem.data.name &&
            <div className="random-popup" onClick={() => setRandomProblem({...randomProblem, ok:false})}    >
                 <RandomPopUp randomProblem={randomProblem} addProblem={addProblem} setRandomProblem={setRandomProblem} />
            </div>}
        </>
    )
}

export default Home
