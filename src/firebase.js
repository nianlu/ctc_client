import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'


const app = firebase.initializeApp({
  apiKey: "AIzaSyCwlJRxXowkO2SPpVC4L3vf6BEPjZa-_KY",
  authDomain: "ctc-web-291704.firebaseapp.com",
  projectId: "ctc-web-291704",
  storageBucket: "ctc-web-291704.appspot.com",
  messagingSenderId: "306964030038",
  appId: "1:306964030038:web:415b90297a53eac6b4d1f7",
  measurementId: "G-N94Z3EMYS5"
})

export const auth = app.auth()
export default app

const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    // console.log(res.user)
  }).catch((error) => {
    console.log(error.message)
  })
}
