import React, { useState, useEffect } from 'react';
import { isBrowser, isMobile } from "react-device-detect";
import { testget, testUpload } from './api';
import * as api from './api';
import Word from './Word';

import * as tf from '@tensorflow/tfjs'

import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
async function init() {
  await register(await connect());
}
init()

// https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
// https://stackoverflow.com/questions/50431236/use-getusermedia-media-devices-in-reactjs-to-record-audio/50440682
// https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
const Recorder = props => {

  const { user, model } = props
  console.log('recorder', user)

  const [recorder, setRecorder] = useState()
  const [blob, setBlob] = useState()
  const [link, setLink] = useState()
  const [info, setInfo] = useState('ready')
  const [status, setStatus] = useState('stop')

  const [reqid, setReqid] = useState()
  const [ana, setAna] = useState()


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
  }

  const onUeStop = () => {
    clearInterval(ueIId)
    console.log('ddd', ueData)
    setStatus('stop')
  }

  const [looogA, setLooogA] = useState()

  const onA = () => {
    // console.log('useeffect')
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    console.log('ona', bufferLength)
    var dataArray = new Uint8Array(bufferLength);
    // var dataArray = new Float32Array(bufferLength)
    // analyser.getByteTimeDomainData(dataArray);

    var source

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      console.log('stream')
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(audioCtx.destination)

      const ttt = stream.getTracks()
      console.log('ttt', ttt)

      console.log('before looog', source)
      setLooogA([])
      const looog = () => {
        console.log('looog')
        // const rid = window.requestAnimationFrame(looog)
        // analyser.getFloatFrequencyData(dataArray);
        analyser.getByteFrequencyData(dataArray);
        // console.log(rid, dataArray);
        // rid !== reqid && setReqid(rid)

        // below will break browser
        // setLooogA([...looogA, dataArray])
      }
      looog()
    })

    console.log('audioctx', audioCtx)
    console.log('analyser', analyser)
  }

  const onStart = () => {
    setLink()
    recorder && recorder.state === 'inactive' && recorder.start()
    console.log(recorder.state)
    setStatus('start')
    setInfo('recording')
  }

  // const stop = () => {
  //   recorder && recorder.state === 'recording' && recorder.stop()
  //   console.log(recorder.state)
  //   setInfo('finished')
  // }

  const onStop = () => {
    recorder && recorder.state === 'recording' && recorder.stop()
    console.log(recorder.state)
  }

  const onPrepare = async _ => {
    console.log('preparing', blob)
    const bbb = await blob.arrayBuffer()
    console.log('preparingbbb', bbb)
    const aaa = new Float32Array(bbb)
    console.log('aaa', aaa)
    const ttt = tf.tensor(aaa)
    console.log('tttt', ttt)

  }
  
  const onCancel = () => {
    window.cancelAnimationFrame(reqid);
  }
  const onRestart = () => {
    window.requestAnimationFrame(reqid);
  }

  const onSave = () => {
    recorder && recorder.state === 'inactive' && 
    console.log(recorder.state)
    // console.log(chunk)
    console.log(blob)

    const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    // const audios = this.state.audios.concat([audioURL]);

    console.log(audioURL)
  }

  const onUpload = () => {
    console.log('upload')
    console.log(blob)
    setInfo('uploading')
    testUpload(
      // {testdata: 'test data'},
      blob,
      data => {
        // console.log(data)
        setInfo('uploaded')
      },
      error => {
        setInfo('failed')
        console.log(error)
      }
    )
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
      {status === 'stop' && ueData &&
        <span>{ueData.length}</span>
      }
      {/* <button disabled={!link} onClick={onPrepare}>prepare</button> */}
      {/* <button onClick={_ => pred(blob)}>test predict</button> */}
      {/* <button disabled={!link}><a href={link}>download</a></button> */}
      {/* <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder