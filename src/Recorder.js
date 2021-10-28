import React, { useState, useEffect } from 'react';
import { isBrowser, isMobile } from "react-device-detect";
import { testget, testUpload } from './api';
import * as api from './api';
import Word from './Word';

import * as tf from '@tensorflow/tfjs'

import * as math from 'mathjs'

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
    // var dataArray = new Uint8Array(bufferLength);
    let data = []

    // every 0.05s
    const iid = setInterval(() => {
      var dataArray = new Uint8Array(bufferLength);
      ueAnalyser.getByteFrequencyData(dataArray)
      // console.log('setinterval', dataArray)
      // const c = data.push(dataArray)
      // if (c > 100)
      //   data.shift()
      const max = Math.max.apply(null, dataArray)
      console.log('recording max', max)
      if (data.length > 1 || max > 70)
        if (data.push(dataArray) > 500)
          data.shift()
      // setUeData(ueData.concat([dataArray]))
    }, 10);

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

    console.log('ddd', JSON.stringify(ueData.map(d => Array.from(d))))
    // const audioURL = window.URL.createObjectURL(blob);
    // const audioURL = window.URL.createObjectURL(ueData);
    const audioURL = window.URL.createObjectURL(new Blob([JSON.stringify(ueData.map(d => Array.from(d)))]), {type : 'application/json'});
    // append videoURL to list of saved videos for rendering
    // const audios = this.state.audios.concat([audioURL]);
    console.log(audioURL)

    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");
    // canvas.setAttribute('width',intendedWidth);
    // const WIDTH = canvas.width;
    // const HEIGHT = canvas.height;
    // const WIDTH = 640;
    const wp = 2
    const WIDTH = wp * ueData.length;
    // const HEIGHT = 1024;
    const wh = 2
    const HEIGHT = 400;

    // // create imageData object
    // var idata = canvasCtx.createImageData(WIDTH, HEIGHT);
    // // set our buffer as source
    // idata.data.set(ueData);
    // // update canvas with new data
    // canvasCtx.putImageData(idata, 0, 0);

    console.log('ueData', ueData.length)
    // canvasCtx.clearRect(0, 0, 800, HEIGHT);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    const flatD = ueData.flatMap(d => Array.from(d))
    console.log('flat', flatD)
    const resultOfQuantile = math.quantileSeq(flatD, 0.95)
    console.log('resultOfQuantile', resultOfQuantile)

    console.log('start print')
    ueData.forEach((d, i) => {
      // canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      // const bufferLength = 1024
      // var dy = (HEIGHT / bufferLength)
      var dx = i * wp
      d.forEach((c, j) => {
        if (j > (HEIGHT/wh)) return
        // var dy = HEIGHT - j
        var dy = HEIGHT - j*wh
        canvasCtx.fillStyle = 'rgb(' + (c > resultOfQuantile? (c-resultOfQuantile)*3+10 : 10) + ',10,10)'; // 255 //rgb(100, 10, 10)
        canvasCtx.fillRect(dx, dy, wp, wh);
      })

      // var barWidth = (WIDTH / bufferLength) * 2.5;
      // var barHeight;
      // var x = 0;
      // for(var i = 0; i < bufferLength; i++) {
      //   barHeight = (d[i] )*2;
      //   canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
      //   canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
      //   x += barWidth + 1;
      // }
    })
    console.log('end print')
// https://github.com/calebj0seph/spectro
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
      <canvas className="visualizer" width="640" height="640"></canvas> 
      {/* <button disabled={!link} onClick={onPrepare}>prepare</button> */}
      {/* <div>
        {ueData && ueData.map(d =>
          <div style={{margin: 0}}>
            {Array.from(d).map(c =>
              <span style={{backgroundColor: '#dc143c'+(c > 99? 99 : c), fontSize: '0.1rem', width: '1px', display: 'inline-block'}}>{c}</span>
              // <span style={{backgroundColor: '#dc143c'+(c > 99? 99 : c)}}><span style={{fontSize: '0.1rem'}}>{c}</span></span>
            )}
          </div>

        )}
      </div> */}
      <button onClick={onPrepare}>prepare</button>
      <button onClick={_ => pred(ueData)}>test predict</button>
      {/* <button disabled={!link}><a href={link}>download</a></button> */}
      {/* <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder