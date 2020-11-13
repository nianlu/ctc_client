import React, { useState } from 'react';
import './App.css';

import Nav from './Nav'

import Recorder from './Recorder'
import Intro from './Intro'
import Confirm from './Confirm'

function App() {
  const [step, setStep] = useState('intro')

  return (
    <div className="App">
      <Nav toStep={setStep} />
      {step === 'intro'?
        <Intro toStep={setStep} />
        : step === 'confirm'?
        <Confirm toStep={setStep} />
        : step === 'recorder'?
        <Recorder toStep={setStep} />
        : <></>
      }
    </div>
  );
}

export default App;
