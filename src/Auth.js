import React, { useState, useEffect } from 'react';
import { signInWithGoogle } from './firebase'
import { AuthProvider, useAuth } from './authContext'

const Auth = (props) => {

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
      <button onClick={signInWithGoogle} >login with google</button>
      <button onClick={_ => handleLogout()} >logout</button>
    </div>
  )
}

export default Auth