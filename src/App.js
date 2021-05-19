import React, { useState, useEffect } from 'react';
import './App.css';

import { AuthProvider, useAuth } from './authContext'

import { signInWithGoogle } from './firebase'
import * as tf from '@tensorflow/tfjs';//Model and metadata URL

import Nav from './Nav'

import Recorder from './Recorder'
import Intro from './Intro'
import Confirm from './Confirm'
import { input } from '@tensorflow/tfjs';
// import model from './tfjs_model/model.json'

const url = {
// model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
model: 'tfjs_model/model.json',
// model: 'https://www.dropbox.com/s/t28sw9z4jtzwi6v/model.json?dl=0'
// metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};

async function testttttt () {

  const audioCtx = new AudioContext();

  //Create audio source
  //Here, we use an audio file, but this could also be e.g. microphone input
  const audioEle = new Audio();
  audioEle.src = 'test.mp3';//insert file name here
  // audioEle.autoplay = true;
  // audioEle.preload = 'auto';
  // const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  // const streamSource = audioCtx.createMediaStreamSource(stream);
  const audioSourceNode = audioCtx.createMediaStreamSource(stream);

  //Create analyser node
  const analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 256;
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);

  //Set up audio node network
  audioSourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);

  //Create 2D canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const canvasCtx = canvas.getContext('2d');
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);


  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);

    //Get spectrum data
    analyserNode.getFloatFrequencyData(dataArray);

    //Draw black background
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    console.log('drawing', dataArray)

    //Draw spectrum
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let posX = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] + 140) * 2;
      canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
      canvasCtx.fillRect(posX, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      posX += barWidth + 1;
    }
  };

  draw();

}

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

  async function loadModel(url) {
    try {
      console.log('loadmodel', url, url.model);
      // const model = await tf.loadLayersModel(url.model);
      const model = await tf.loadGraphModel(url.model);
      console.log('loadmodel', model);
      setModel(model)
      console.log('loadmodel', model);
    } catch (err) {
      console.log(err);
    }
  }
  async function loadMetadata(url) {
    try {
      const metadataJson = await fetch(url.metadata);
      const metadata = await metadataJson.json();
      setMetadata(metadata)
      console.log('loadmetadata', metadata);
    } catch (err) {
      console.log(err);
    }
  }

  //React Hook
  const [metadata, setMetadata] = useState();
  const [model, setModel] = useState();
  useEffect(()=>{
    tf.ready().then(()=>{
    console.log('tf-ready')
    loadModel(url)
    // loadMetadata(url)
    });
  },[])

  const [score, setScore] = useState();
  const pred = input => {
    input = 'xxx'
    console.log('predicting', input)
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    setScore(score)
  }

  return (
    <div className="App">
      <Nav toStep={setStep} />
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
      <button onClick={pred}>test predict</button>
      {step === 'intro'?
        <Intro toStep={setStep} />
        : step === 'confirm'?
        <Confirm toStep={setStep} onChangeGroup={v => setUser({...user, group: v})} />
        : step === 'recorder'?
        <Recorder toStep={setStep} user={user} />
        : <></>
      }
      <button onClick={testttttt}>xxxx</button>
    </div>
  );
}

export default App;
