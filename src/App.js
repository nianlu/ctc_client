import React, { useState } from 'react';
import './App.css';

import Nav from './Nav'

import Recorder from './Recorder'
import Intro from './Intro'
import Confirm from './Confirm'

const random = max => Math.floor(Math.random() * Math.floor(max));

function App() {
  const [user, setUser] = useState({uid: 10000+random(9999), group: 'non-native'})
  const [step, setStep] = useState('intro')
  // console.log('app', user)

  return (
    <div className="App">
      <Nav toStep={setStep} />
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
