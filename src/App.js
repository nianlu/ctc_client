import React, { useState } from 'react';
import './App.css';

import { AuthProvider, useAuth } from './authContext'

import { signInWithGoogle } from './firebase'

import Nav from './Nav'

import Recorder from './Recorder'
import Intro from './Intro'
import Confirm from './Confirm'

const random = max => Math.floor(Math.random() * Math.floor(max));

const TestAuth = () => {
  const { currentUser, login, logout } = useAuth()

  const [ username, setUsername ] = useState()
  const [ password, setPassword ] = useState()
  // console.log('cu', currentUser)

  const handleLogin = (username, password) => {
    console.log('login', username, password)
    login(username, password)
  }

  const handleLogout = () => {
    console.log('logout')
    logout()
  }

  return (
    <div>
      <p>{currentUser && currentUser.email}</p>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={_ => handleLogin(username, password)} >login</button>
      <button onClick={_ => handleLogout()} >logout</button>
      <button onClick={signInWithGoogle} >test google</button>
    </div>
  )
}

function App() {
  const [user, setUser] = useState({uid: 10000+random(9999), group: 'non-native'})
  const [step, setStep] = useState('intro')
  // console.log('app', user)


  return (
    <div className="App">
      <Nav toStep={setStep} />
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
      {step === 'intro'?
        <Intro toStep={setStep} />
        : step === 'confirm'?
        <Confirm toStep={setStep} onChangeGroup={v => setUser({...user, group: v})} />
        : step === 'recorder'?
        <Recorder toStep={setStep} user={user} />
        : <></>
      }
    </div>
  );
}

export default App;
