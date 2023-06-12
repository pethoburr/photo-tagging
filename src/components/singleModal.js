import { collection, getDocs } from 'firebase/firestore';
import { db } from '../App';
import { app } from '../App';
import { getAuth } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';

let boolien = true;

function SingleModal ({ props , time }) {
    const buttonRef = useRef(null);
    const [el, setEl] = useState([]);
    const name = getAuth(app).currentUser.displayName;

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


    const handleClickAuto = () => {
        buttonRef.current.click();
        
    }

    useEffect(() => {
        handleClickAuto();
        
        if (boolien) {
          props(time, name);
          getScores();
          boolien = false;
        } else {
          boolien = true;
        }
      },[]);

        return(
            <div className="singleContainer">
<button type="button" ref={buttonRef} hidden class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Leaderboard</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className='legend'><p>Rank</p><p>Name</p><p>Time</p><p>date</p></div>
        {el.map((ting, index) => <li className='scoreList'>{index + 1}<p>{ting.name}</p><p>{ting.time.minutes.toString().padStart(2, '0')}:{ting.time.seconds.toString().padStart(2, '0')}</p><p>{ting.date}</p></li>)}
      </div>
      <div class="modal-footer">
      </div>
    </div>
  </div>
</div>
            </div>
        )
}

export default SingleModal;