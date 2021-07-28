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
  // console.log('recorder', user)

  const [recorder, setRecorder] = useState()
  const [blob, setBlob] = useState()
  const [link, setLink] = useState()
  const [info, setInfo] = useState('ready')
  const [status, setStatus] = useState('stop')

  // TODO refer to chrome-music-lab
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      const options = {
        audioBitsPerSecond : 48000,
        mimeType: 'audio/wav'
      }
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorder.ondataavailable = function(e) {
        if (mediaRecorder.state === 'inactive') {
          console.log(e.data)
          setBlob(e.data)
          const audioURL = window.URL.createObjectURL(e.data);
          setLink(audioURL)
          console.log(audioURL)
          setStatus('stop')
          setInfo('ready')
        } else console.log('not finished')
      }
      setRecorder(mediaRecorder)
    })
  }, [])

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
      {isMobile?
        <button className='ctc-mobile-record'
          onTouchStart={status === 'stop'? onStart : _ => {}}
          onTouchEnd={status === 'start'? onStop : _ => {}}
        >
          {status === 'stop'?
            'start'
          :
            '...'
          }
        </button>
      : status === 'stop'?
        <button className='ctc-button' onClick={onStart}>start</button>
      : status === 'start'?
        <button className='ctc-button' onClick={onStop}>stop</button>
      :
        <button className='ctc-button' disabled={true} onClick={onStop}>stop</button>
      }
      <button disabled={!link} onClick={onPrepare}>prepare</button>
      {/* <button onClick={_ => pred(blob)}>test predict</button> */}
      <button disabled={!link}><a href={link}>download</a></button>
      {/* <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder