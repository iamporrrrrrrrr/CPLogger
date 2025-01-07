export interface Problem{
    _id: string,
    id: string,
    name: string,
    rating: number,
    tags: string[],
    status: 0 | 1 | 2,
    userId: string
}

export interface CFProblem{
    contestId: number,
    problemsetName:	string,
    index: string,
    name: string,
    type: string,
    points: number,
    rating: number,
    tags: string[]
}