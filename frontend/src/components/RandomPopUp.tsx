import React from "react";
import { CFProblem } from "../utils/interfaces";
interface RandomPopUpProps {
  randomProblem: { ok: boolean, data: CFProblem }
  setRandomProblem: React.Dispatch<React.SetStateAction<{ ok: boolean, data: CFProblem }>>
  addProblem: (problemId: string) => void;
}

const RandomPopUp: React.FC<RandomPopUpProps> = ({ randomProblem, setRandomProblem, addProblem }) => {
  return (
    <>
      <div className="random-popup-box" onClick={e => e.stopPropagation()}>
        <div className="random-popup-content">
          <span>{`${randomProblem.data.contestId}${randomProblem.data.index}. ${randomProblem.data.name}`}</span>
          <span><b>Rating:</b><span>{` ${randomProblem.data.rating ? randomProblem.data.rating : '-'}`}</span></span>
          <span><b>Tags:</b></span>
          <div className="random-popup-tag-container">{randomProblem.data.tags.map((tag: string, index: number) => {
            return (
              <span className='random-popup-tag' key={`randomtag-${index}`}>{tag}</span>
            )
          })}
          </div>
        </div>
        <div className="random-popup-button-container">
          <button onClick={() => {
            setRandomProblem({ ...randomProblem, ok: false })
            addProblem(`${randomProblem.data.contestId}${randomProblem.data.index}`)
          }}
            className="random-popup-add"
          >Add</button>
          <button onClick={() => setRandomProblem({ ...randomProblem, ok: false })} className="random-popup-close">Close</button>
        </div>
      </div>
    </>
  )
}

export default RandomPopUp