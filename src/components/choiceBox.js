import '../stylesheets/choices.css';
import SingleModal from './singleModal';
import Modal from './modal';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
  } from 'firebase/auth';
  import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
  } from 'firebase/firestore';
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';
import { db } from '../App';
import { app } from '../App';
import { useEffect, useState } from 'react';

function ChoiceBox ({ pos, goog, watch, clock, click, k, c, h }) {
    const [found, setFound] = useState(0);
    const [said, setSaid] = useState(false);
    const peeps = [{
      name: 'karen',
      func: k
    },
  {
    name: 'creep',
    func: c
  },
{
  name: 'high guy',
  func: h
}]



useEffect(() => {
  if (found === 3) {
    if (!said) {
      alert('you found em all!');
      setSaid(true);
    }
  }
}, [found, said])


async function saveTime(num, playerName) {
  try {
    await addDoc(collection(getFirestore(), 'Leaderboard'), {
      name: playerName,
      date: new Date().toLocaleDateString(),
      time: num
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}
const finder = () => {
  if(found === 3) {
    watch();
  }
}
  finder();


    const handleClick = async (e) => {
        let misses = 0;
        const querySnapshot = await getDocs(collection(db, 'players'));
        console.log(click[0],click[1]);
        querySnapshot.forEach((doc) => {
            const shit = doc.data();
            console.log(`docs: ${shit.left}, ${shit.right}, ${shit.top}, ${shit.bottom}`)
            if (click[0] > shit.left && click[0] < shit.right && click[1] > shit.top && click[1] < shit.bottom ) {
              if (e.target.textContent === shit.name) {
                setFound(found + 1);
                for (let i = 0; i < peeps.length; i++) {
                  if (peeps[i].name === shit.name) {
                    peeps[i].func();
                  }
                }
                return alert(`you found ${shit.name}`);
              } else {
                return alert(`thats not ${e.target.textContent}`)
              } 
            } else {
              misses++;
            }
          });
          if (misses === 3) {
            alert(`thats not ${e.target.textContent}`);
          }
    }

    return (
        <div>
            <div
            id='box'
            style={{
            position: 'absolute',
            top: pos.y - 15,
            left: pos.x - 15,
            width: '2rem',
            height: '2rem',
            border: '2px solid red',
            borderRadius: '50%',
            zIndex: 1,
          }}
        ><div className="options">
        <div onClick={handleClick}>karen</div>
        <div className='middle' onClick={handleClick}>creep</div>
        <div onClick={handleClick}>high guy</div>
    </div>
    </div>
    { found === 3 && goog === false && <Modal props={saveTime} name={goog} time={clock} /> }
    { found === 3 && goog === true && <SingleModal props={saveTime} time={clock}  /> }
        </div>
    )
}

export default ChoiceBox;