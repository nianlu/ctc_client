import React, { useState, useEffect } from 'react';
import { isBrowser, isMobile } from "react-device-detect";
import { testget, testUpload } from './api';
import * as api from './api';
import Word from './Word';

import * as tf from '@tensorflow/tfjs'
// import * as tfnode from '@tensorflow/tfjs-node'

import * as math from 'mathjs'

import Spectrogram from 'spectrogram'

// const customSpectrogram = 

Spectrogram.prototype._draw = function(array, canvasContext) {
    if (this._paused) {
      return false;
    }

    var canvas = canvasContext.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var tempCanvasContext = canvasContext._tempContext;
    var tempCanvas = tempCanvasContext.canvas;
    tempCanvasContext.drawImage(canvas, 0, 0, width, height);

    for (var i = 0; i < array.length; i++) {
      var value = array[i];
      canvasContext.fillStyle = this._getColor(value);
      if (this._audioEnded) {
        canvasContext.fillStyle = this._getColor(0);
      }
      canvasContext.fillRect(width - 1, height - i, 1, 1);
      // canvasContext.fillRect(width - 4, height - i, 4, 1);
      // canvasContext.fillRect(width - 4, height - (i*4), 4, 4);
    }

    canvasContext.translate(-1, 0);
    // canvasContext.translate(-4, 0);
    // draw prev canvas before translation
    canvasContext.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);
    canvasContext.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);
    // reset transformation matrix
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    // canvasContext.setTransform(1, 0, 0, 1, 0, 0);

    this._baseCanvasContext.drawImage(canvas, 0, 0, width, height);
};

Spectrogram.prototype.resume = function(offset) {
  var source = this._sources[Object.keys(this._sources)[0]];
  console.log('resume', source, this._sources)
  this._paused = false;
  if (this._pausedAt) {
    console.log('resume2', this._pausedAt, source)
    this.connectSource(source.audioBuffer, source.audioContext);
    this.start(offset || (this._pausedAt / 1000));
  }
};

Spectrogram.prototype._startMediaStreamDraw = function(analyser, canvasContext) {
  window.requestAnimationFrame(this._startMediaStreamDraw.bind(this, analyser, canvasContext));
  var audioData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(audioData);
  this._draw(audioData, canvasContext);
  // var audioData = new Uint8Array(analyser.frequencyBinCount);
  // analyser.getByteFrequencyData(audioData);
  // this._draw(audioData, canvasContext);
  // var audioData = new Uint8Array(analyser.frequencyBinCount);
  // analyser.getByteFrequencyData(audioData);
  // this._draw(audioData, canvasContext);
  // var audioData = new Uint8Array(analyser.frequencyBinCount);
  // analyser.getByteFrequencyData(audioData);
  // this._draw(audioData, canvasContext);
};

// https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
// https://stackoverflow.com/questions/50431236/use-getusermedia-media-devices-in-reactjs-to-record-audio/50440682
// https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
const Recorder = props => {

  const { user, model } = props
  console.log('recorder', user)

  const [recorder, setRecorder] = useState()
  const [info, setInfo] = useState('ready')
  const [status, setStatus] = useState('stop')
  const [link, setLink] = useState()

  const [ueAnalyser, setUeAnalyser] = useState()
  const [ueIId, setUeIId] = useState()
  // const [ueRun, setUeRun] = useState(false)
  const [ueData, setUeData] = useState()

  const [spectrogram, setSpectrogram] = useState()

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const spectro = Spectrogram(document.getElementById('canvas'), {
      canvas: {
        width: 128,
        // width: function() {
        //   return window.innerWidth;
        // },
        height: 128
      },
      audio: {
        enable: true
      },
    });

    // try {
    //   audioContext = new AudioContext();
    // } catch (e) {
    //   alert('No web audio support in this browser!');
    // }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      // console.log('stream')

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser()

      analyser.smoothingTimeConstant = 0.3
      analyser.fftSize = 2048 / 2
      // analyser.fftSize = 2048 / 8
      // analyser.minDecibels = -65;
      analyser.minDecibels = -75;
      // analyser.maxDecibels = -10;
      analyser.maxDecibels = -30;

      source.connect(analyser);
      // analyser.connect(audioCtx.destination)
      // setUeAnalyser(analyser)
      // console.log('setanalyser')

      spectro.connectSource(analyser, audioCtx);
      // spectro.start();
      setSpectrogram(spectro)
    })

  }, [])
  
  const onStart = () => {
    spectrogram && status === 'stop'? spectrogram.start() : spectrogram.resume(10)
    // spectrogram && spectrogram.clear()
    // spectrogram && spectrogram.start()
    setStatus('start')
  }

  const onStop = () => {
    spectrogram && spectrogram.pause()
    setStatus('pause')
    // const dataURL = document.getElementById('canvas').toDataURL("image/png", 0.1)
    const tftensor = tf.browser.fromPixels(document.getElementById('canvas'))
    console.log('tftensor', tftensor)
    const resized = tf.image.resizeBilinear(
        tftensor, [48, 48], true
      ).slice([0, 0, 0], [48, 48, 1]).reshape([1, 48, 48, 1])
      // .print()
    // const rd = resized.dataSync();
    const tr = tf.transpose(resized)
    const rr = tf.reverse(tr, [2])
    const rd = rr.dataSync();
    const ard = Array.from(rd)
    const srd = JSON.stringify(ard)
    const ra = resized.arraySync();
    console.log('resized', rd, ard, srd, ra)
    pred(resized)
    // document.getElementById('canvas').toBlob(blob => {
    //   blob.arrayBuffer().then(buffer => {
    //     console.log('blob', blob)
    //     const imageArray = new Uint8Array(buffer);
    //     // const pngDecodedTensor = tfnode.node.decodePng(imageArray);
    //     // pred(pngDecodedTensor)
    //   })
    // })
    // const canvasCtx = document.getElementById('canvas').getContext('2d')
    // var imageData = canvasCtx.getImageData(0, 0, 500, 500);
    // console.log(imageData.data);

    // setLink(dataURL)
    // console.log('dt', dataURL)
    // console.log('cctx', canvasCtx)
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
    const predictOut = model.predict(input)
    // const score = predictOut.dataSync()[0];
    const label = predictOut.argMax(1)
    const score = predictOut.dataSync();
    // setScore(score)
    console.log('predictOut', predictOut)
    console.log('score', score, label)
    predictOut.print()
    predictOut.dispose();
  }

  return (
    <div>
      <Word />
      <div style={{marginBottom: '1rem'}}>{info}</div>
      {/* <button className='ctc-button' onClick={onStart}>Start</button>
      <button className='ctc-button' onClick={onStop}>Stop</button> */}
      {/* <button className='ctc-button' onClick={onCancel}>cancel</button>
      <button className='ctc-button' onClick={onRestart}>restart</button> */}
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
      : status === 'pause'?
        <button className='ctc-button' onClick={onStart}>start</button>
      : status === 'start'?
        <button className='ctc-button' onClick={onStop}>stop</button>
      :
        <button className='ctc-button' disabled={true} onClick={onStop}>stop</button>
      }
      <br />
      {status === 'stop' && ueData &&
        <span>{ueData.length}</span>
      }
      <br />
      <canvas id='canvas'></canvas> 
      <canvas className="visualizer" width="128" height="128"></canvas> 
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
      {/* <button onClick={onPrepare}>prepare</button> */}
      <button onClick={_ => pred(ueData)}>test predict</button>
      <button disabled={!link}><a href={link}>download</a></button>
      {/* <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder