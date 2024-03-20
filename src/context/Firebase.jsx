import { createContext, useContext , useState, useEffect} from 'react'
import { initializeApp } from 'firebase/app'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, Firestore , getDocs, query, where, Query, deleteDoc} from 'firebase/firestore';

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyBGQIRMvYHy8LO3FcENck38jNSBJf2vS58",
    authDomain: "todo-9e7dd.firebaseapp.com",
    projectId: "todo-9e7dd",
    storageBucket: "todo-9e7dd.appspot.com",
    messagingSenderId: "219846130621",
    appId: "1:219846130621:web:3eadbd2688a5e4877e70d4"
  };

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig)
const firebaseauth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp)

const googleProvider = new GoogleAuthProvider()

export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null)

    useEffect(() =>{
        onAuthStateChanged(firebaseauth, user => {
            if(user) setUser(user);
            else setUser(null)
        })
    }, [firebaseauth, user])

     const signupUserWithEmailAndPassword = (email, password) => 
     createUserWithEmailAndPassword(firebaseauth, email, password);

     const signinUserWithEmailAndPassword = (email, password) => 
     signInWithEmailAndPassword(firebaseauth, email, password)

     const signinWithGoogle = () => 
     signInWithPopup(firebaseauth, googleProvider)

     

     const handleCreateTodo = async ( TodoText) =>{
         return  await addDoc(collection(firestore, 'Todos'),{
            userId: user.uid,
            TodoText
          })
     } 

     const listTodos = async () => {
        if(!user) return null;
       const collectionRef = collection(firestore, "Todos")
       const q = query(collectionRef, where("userId", "==", user.uid ));
        const snap = await getDocs(q);
        return snap;
     }
     //delete todo
     const deleteTodo = async (id) => {
        try {
            await deleteDoc(doc(firestore, "Todos", id));
            console.log("Todo deleted successfully");
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    }
    



     const isLoggedIn = user ? true : false;

    return (
        <FirebaseContext.Provider value={ {signupUserWithEmailAndPassword, deleteTodo,  signinUserWithEmailAndPassword,firebaseauth, signinWithGoogle, isLoggedIn, user, listTodos,handleCreateTodo}} >
            {props.children}
        </FirebaseContext.Provider>
    )
}
