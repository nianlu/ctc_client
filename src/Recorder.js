import React, { useState, useEffect } from 'react';
import { isBrowser, isMobile } from "react-device-detect";
import { testget, testUpload } from './api';
import * as api from './api';
import Word from './Word';

// https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
// https://stackoverflow.com/questions/50431236/use-getusermedia-media-devices-in-reactjs-to-record-audio/50440682
// https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
const Recorder = props => {

  const { user } = props
  // console.log('recorder', user)

  const [recorder, setRecorder] = useState()
  const [chunk, setChunk] = useState()
  const [blob, setBlob] = useState()
  const [link, setLink] = useState()
  const [info, setInfo] = useState('ready')
  const [status, setStatus] = useState('stop')
  const [test, setTest] = useState('init')

  const audioContext = new(window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  async function xxx() {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    const streamSource = audioContext.createMediaStreamSource(stream);
    analyser.fftSize = 2048 //fftSize * 2;
    analyser.smoothingTimeConstant = 0.0;
    streamSource.connect(analyser);
    // streamSource.start(0)

    var dataArray = new Float32Array(analyser.frequencyBinCount); // Float32Array should be the same length as the frequencyBinCount
    void analyser.getFloatFrequencyData(dataArray);
    console.log('xxx1', dataArray)
    void analyser.getFloatFrequencyData(dataArray);
    console.log('xxx2', dataArray)
    void analyser.getFloatFrequencyData(dataArray);
    console.log('xxx3', dataArray)
    void analyser.getFloatFrequencyData(dataArray);
    console.log('xxx4', dataArray)
    void analyser.getFloatFrequencyData(dataArray);
    console.log('xxx5', dataArray)
  }

  const handc = () => {
    var dataArray = new Float32Array(analyser.frequencyBinCount); // Float32Array should be the same length as the frequencyBinCount
    void analyser.getFloatFrequencyData(dataArray);
    console.log('xxx1', dataArray)
  }

  // TODO refer to chrome-music-lab
  useEffect(() => {
    setTest('1')
    console.log('ue')
    xxx()
    console.log('ue-end')

      // // Reset the queue.
      // freqDataQueue = [];
      // freqData = new Float32Array(fftSize);
      // if (includeRawAudio) {
      //   timeDataQueue = [];
      //   timeData = new Float32Array(fftSize);
      // }

  }, [])

  const onStart = () => {
    setTest('4')
    setChunk()
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
    setTest('5')
    recorder && recorder.state === 'recording' && recorder.stop()
    console.log(recorder.state)
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

  return (
    <div>
      <Word />
      <div style={{marginBottom: '1rem'}}>{test}</div>
      <div style={{marginBottom: '1rem'}}>{info}</div>
      <button className='ctc-button' onClick={handc}>start</button>
      {isMobile?
        <button className='ctc-mobile-record'
          onTouchStart={status === 'stop'? onStart : _ => {}}
          onTouchEnd={status === 'start'? onStop : _ => {}}
          style={{userSelect: 'none', WebkitUserSelect: 'none'}}
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
      {/* <button disabled={!link}><a href={link}>download</a></button>
      <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder