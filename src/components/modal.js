import '../stylesheets/modal.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../App';
import { useEffect, useRef, useState } from 'react';

function Modal ({ props, time }) {
    const buttonRef = useRef(null);
    const [playerName, setPlayerName] = useState('');
    const [el, setEl] = useState([]);

    const getScores = async () => {
      const querySnapshot = await getDocs(collection(db, 'Leaderboard' ));
      querySnapshot.forEach((doc) => {
      const shit = doc.data();
      console.log(shit);
      setEl(prevState => [...prevState, shit].sort((a, b) => {
        const totalTimeA = a.time.minutes * 60 + a.time.seconds;
        const totalTimeB = b.time.minutes * 60 + b.time.seconds;
        return totalTimeA - totalTimeB;
      }));
    })
  }

    const handleName = (e) => {
        setPlayerName(e.target.value);
    }

    const handleClickAuto = () => {
        buttonRef.current.click();
    }


    const saveScore = () => {
      props(time, playerName);
      getScores();
    }
  

    useEffect(() => {
      handleClickAuto();
    },[]);

    

    return (
       <div className="enterName">
          <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Set name</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Save your name to be added to the leaderboards.
        <input type='text' onChange={handleName}></input>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" data-bs-target="#exampleModalToggle2" onClick={saveScore} data-bs-toggle="modal">Submit</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Leader Board</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul>
          <div className='legend'><p>Rank</p><p>Name</p><p>Time</p><p>date</p></div>
            {el.map((ting, index) => <li className='scoreList'>{index + 1}<p>{ting.name}</p><p>{ting.time.minutes.toString().padStart(2, '0')}:{ting.time.seconds.toString().padStart(2, '0')}</p><p>{ting.date}</p></li>)}
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" hidden>Back to first</button>
      </div>
    </div>
  </div>
</div>
<button class="btn btn-primary" data-bs-target="#exampleModalToggle" ref={buttonRef} data-bs-toggle="modal" hidden>Open first modal</button>
Change
       </div>
    )
}

export default Modal;