import React, { useState, useEffect } from 'react';
import { isBrowser, isMobile } from "react-device-detect";
import { testget, testUpload } from './api';
import * as api from './api';
import Word from './Word';

import * as tf from '@tensorflow/tfjs'

// https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
// https://stackoverflow.com/questions/50431236/use-getusermedia-media-devices-in-reactjs-to-record-audio/50440682
// https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
const Recorder = props => {

  const { user, model } = props
  console.log('recorder', user)

  const [recorder, setRecorder] = useState()
  const [info, setInfo] = useState('ready')
  const [status, setStatus] = useState('stop')

  const [ueAnalyser, setUeAnalyser] = useState()
  const [ueIId, setUeIId] = useState()
  // const [ueRun, setUeRun] = useState(false)
  const [ueData, setUeData] = useState()

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      console.log('stream')

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser()
      source.connect(analyser);
      analyser.connect(audioCtx.destination)

      setUeAnalyser(analyser)
      console.log('setanalyser')
    })
  }, [])

  const onUeStart = () => {

    var bufferLength = ueAnalyser.frequencyBinCount;
    console.log('ona', bufferLength)
    var dataArray = new Uint8Array(bufferLength);
    let data = []

    // every 0.1s
    const iid = setInterval(() => {
      ueAnalyser.getByteFrequencyData(dataArray)
      console.log('setinterval', dataArray)
      // const c = data.push(dataArray)
      if (data.push(dataArray) > 100)
        data.shift()
      // setUeData(ueData.concat([dataArray]))
    }, 100);

    setUeData(data)
    setUeIId(iid)
    console.log('iid', iid)
    setStatus('start')
    setInfo('recording')
  }

  const onUeStop = () => {
    clearInterval(ueIId)
    console.log('ddd', ueData)
    setStatus('stop')
    setInfo('finished')
  }

  const onPrepare = async _ => {
    // console.log('preparing', blob)
    // const bbb = await blob.arrayBuffer()
    // console.log('preparingbbb', bbb)
    // const aaa = new Float32Array(bbb)
    // console.log('aaa', aaa)
    // const ttt = tf.tensor(aaa)
    // console.log('tttt', ttt)

    console.log('ppp', ueData)
    const ttt = tf.tensor(ueData)
    console.log('tttt', ttt)

    pred(ttt)

  }
  
  const onSave = () => {
    recorder && recorder.state === 'inactive' && 
    console.log(recorder.state)
    // console.log(chunk)
    // console.log(blob)

    // const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    // const audios = this.state.audios.concat([audioURL]);

    // console.log(audioURL)
  }

  const mobileButtonStyle = {
    borderRadius: '50%',
    height: '5rem',
    width: '5rem',
    fontSize: '1.2rem'
  }

  const pred = input => {
    // input = 'xxx'
    console.log('predicting', input)
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    // setScore(score)
  }

  return (
    <div>
      <Word />
      <div style={{marginBottom: '1rem'}}>{info}</div>
      {/* <button className='ctc-button' onClick={onUeStart}>Start</button>
      <button className='ctc-button' onClick={onUeStop}>Stop</button> */}
      {/* <button className='ctc-button' onClick={onCancel}>cancel</button>
      <button className='ctc-button' onClick={onRestart}>restart</button> */}
      {isMobile?
        <button className='ctc-mobile-record'
          onTouchStart={status === 'stop'? onUeStart : _ => {}}
          onTouchEnd={status === 'start'? onUeStop : _ => {}}
        >
          {status === 'stop'?
            'start'
          :
            '...'
          }
        </button>
      : status === 'stop'?
        <button className='ctc-button' onClick={onUeStart}>start</button>
      : status === 'start'?
        <button className='ctc-button' onClick={onUeStop}>stop</button>
      :
        <button className='ctc-button' disabled={true} onClick={onUeStop}>stop</button>
      }
      <br />
      {status === 'stop' && ueData &&
        <span>{ueData.length}</span>
      }
      <br />
      {/* <button disabled={!link} onClick={onPrepare}>prepare</button> */}
      <button onClick={onPrepare}>prepare</button>
      <button onClick={_ => pred(ueData)}>test predict</button>
      {/* <button disabled={!link}><a href={link}>download</a></button> */}
      {/* <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder