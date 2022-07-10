import firebase from "../firebase";
import { getFirestore, collection, getDocs, doc, setDoc, onSnapshot } from 'firebase/firestore';
const db = getFirestore(firebase);
const scoreBoardCol = collection(db, 'scoreboard');

const getDoc = async () =>{        
    const a = await getDocs(scoreBoardCol);
    return a.docs.slice(0,1)[0];
}

const getDocRef = async () => {
        const id = (await getDoc()).id;
        return doc(db, 'scoreboard', id);
}

const get = async () => {
    const doc = await getDoc();
    return doc.data();
}

const save = async (data) => {
        const docRef = await getDocRef();
      await setDoc(docRef, {...data});
}

const listen = async (callback) => { 
    onSnapshot(await getDocRef(), (doc) => {    
      callback(doc.data());
  });
}


export default { get, save, getDocRef, listen};