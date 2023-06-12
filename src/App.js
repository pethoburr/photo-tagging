import './App.css';
import { initializeApp } from "firebase/app";
import { useEffect, useState, useRef } from 'react';
import creeper from '../src/assets/creep.jpg';
import highGuy from '../src/assets/drugskickedin.jpg';
import karen from '../src/assets/wildkaren.jpg';
import ChoiceBox from './components/choiceBox';
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

const firebaseConfig = {
  apiKey: "AIzaSyClhJWT3NrIqvTEpVSuCJg6i5dKIIQGpq4",
  authDomain: "photo-tagging-8b154.firebaseapp.com",
  projectId: "photo-tagging-8b154",
  storageBucket: "photo-tagging-8b154.appspot.com",
  messagingSenderId: "600259981892",
  appId: "1:600259981892:web:6df7f1b3322c236541c211"
};



export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

async function savePlayers(player) {
  try {
    await addDoc(collection(getFirestore(), 'players'), {
      top: player.top,
      bottom: player.bottom,
      left: player.left,
      right: player.right
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

const creep = { top: 33, bottom: 38, left: 57,right: 60};
const wildKaren = { top: 25, bottom: 29, left: 36, right: 38};
const highGuyy = { top: 35, bottom: 41, left: 48, right: 50};

// savePlayers(creep);
// savePlayers(wildKaren);
// savePlayers(highGuyy);

function App() {
  const [userName, setUserName] = useState('');
  const [url, setUrl] = useState('');
  const [show, setShow] = useState('true');
  const [google, setGoogle] = useState('');
  const [boxPosition, setBoxPosition] = useState(null);
  const [currentClick, setCurrentClick] = useState([]);
  const [time, setTime] = useState({ minutes: 0, seconds: 0});
  const [isActive, setIsActive] = useState(true);
  const [foundKaren, setFoundKaren] = useState(true);
  const [foundCreep, setFoundCreep] = useState(true);
  const [foundGuy, setFoundGuy] = useState(true);

  let signOutBtn = <button className='sign' onClick={() => signOutUser()} >SIGN OUT</button>;
  let signInBtn = <button className='sign' onClick={() => signIn()}>SIGN IN WITH GOOGLE</button>;

  const imageRef = useRef(null);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          const seconds = prevTime.seconds + 1;
          const minutes = prevTime.minutes;

          if (seconds === 60) {
            return {
              minutes: minutes + 1,
              seconds: 0
            };
          } else {
            return {
              minutes: minutes,
              seconds: seconds
            };
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive]);

  const handleStop = () => {
    setIsActive(false);
  };

  const changeFoundKaren = () => {
      setFoundKaren(false);
  }

  const changeFoundCreep = () => {
    setFoundCreep(false);
}

  const changeFoundGuy = () => {
  setFoundGuy(false);
  }

  function handleClick(event) {
    const image = imageRef.current;
    const imageWidth = image.clientWidth;
    const imageHeight = image.clientHeight;
    const offsetX = image.offsetLeft;
    const offsetY = image.offsetTop;
    const x = event.pageX - offsetX;
    const y = event.pageY - offsetY;
    const relativeX = Math.round((x / imageWidth) * 100);
    const relativeY = Math.round((y / imageHeight) * 100);
    setBoxPosition({ x: x, y: y });
    setCurrentClick([relativeX, relativeY]);
    }

   async function signIn() {
      let provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(app), provider);
    setGoogle(true);
  }

  function getProfilePicUrl() {
    return getAuth(app).currentUser.photoURL;
  }
  
  function getUserName() {
    return getAuth(app).currentUser.displayName;
  }

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(app), authStateObserver);
  }

  const authStateObserver = (user) => {
    if (user) {
      let profilePicUrl = getProfilePicUrl();
      let userName = getUserName();
      setUrl(profilePicUrl);
      setUserName(userName);
      setShow(false);
    } else {
      setUserName('');
      setUrl('');
      setShow(true);
    }
  }


  const signOutUser = () => {
    signOut(getAuth(app));
    setUserName('');
    setUrl('');
    setGoogle(false);
  }

  const isUserSignedIn = () => {
    return !!getAuth(app).currentUser;
  }
  
  useEffect(() => {
    initFirebaseAuth();
  });

  useEffect(() => {
    
    if (isUserSignedIn()) {
    // console.log('true');
      setGoogle(true);
    } else {
    //  console.log('false');
      setGoogle(false);
    }
  })

  return (
    <div className="App">
      <nav>
      <div className='contain'>
        <div>
      <h2>Find these weirdos:</h2>
      <div className='time'>{`${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`}</div>
      </div>
      
      <div className='finders'>
        {foundKaren && <div><img src={karen} className='find'></img><p className='text'>Karen</p></div>}
        </div>
        <div className='finders'>
        {foundCreep && <div><img src={creeper} className='find'></img><p className='text'>Creep</p></div>}
        </div>
        <div className='finders'>
        {foundGuy && <div><img src={highGuy} className='find'></img><p className='text'>High Guy</p></div>}
        </div>
        
      <div className='signIn'>
      <img src={url}></img><div>{userName}</div>
      { show? signInBtn : signOutBtn }
      </div>
      </div>
      </nav>
      <div className='body' onClick={handleClick} ref={imageRef}>
      {boxPosition && (
        <ChoiceBox pos={boxPosition} goog={google} watch={handleStop} clock={time} click={currentClick} k={changeFoundKaren} c={changeFoundCreep} h={changeFoundGuy} />
      )}
      </div>
    </div>
  );
}


export default App ;

