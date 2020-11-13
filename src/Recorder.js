import React, { useState, useEffect } from 'react';
import { testget, testUpload } from './api';
import * as api from './api';
import Word from './Word';

// https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
// https://stackoverflow.com/questions/50431236/use-getusermedia-media-devices-in-reactjs-to-record-audio/50440682
// https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
const Recorder = () => {

  const [recorder, setRecorder] = useState()
  const [chunk, setChunk] = useState()
  const [blob, setBlob] = useState()
  const [link, setLink] = useState()
  const [info, setInfo] = useState('ready')
  const [status, setStatus] = useState('stop')

  // const handleSuccess = function(stream) {
  //   console.log('init rec')
  //   // const context = new AudioContext();
  //   // const source = context.createMediaStreamSource(stream);
  //   // const processor = context.createScriptProcessor(1024, 1, 1);

  //   // source.connect(processor);
  //   // processor.connect(context.destination);

  //   // processor.onaudioprocess = function(e) {
  //   //   // Do something with the data, e.g. convert it to WAV
  //   //   // console.log(e.inputBuffer);
  //   // };

  // };

  // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  //     .then(handleSuccess);

  // TODO refer to chrome-music-lab
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      const options = {
        audioBitsPerSecond : 48000,
      }
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorder.ondataavailable = function(e) {
        // chunks.push(e.data);
        // console.log(e.data)
        setChunk(e.data)
        if (mediaRecorder.state === 'inactive') {
          // const testb = new Blob(e.data, { type: 'audio/webm' });
          console.log(e.data)
          setBlob(e.data)
          const audioURL = window.URL.createObjectURL(e.data);
          // setLink(audioURL)
          // console.log(audioURL)
          setStatus('upload')
          setInfo('uploading')
          api.upload(
            e.data,
            {'User-Id': 1, 'File-Name': 'test', 'File-Type': e.data.type},
            data => {
              // console.log(data)
              setStatus('stop')
              setInfo('uploaded')
            },
            error => {
              setStatus('stop')
              setInfo('upload failed')
              console.log(error)
            }
          )
        } else console.log('not finished')
      }
      setRecorder(mediaRecorder)
      // setChunk([])
    })
  }, [])

  const start = () => {
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

  const stop = () => {
    recorder && recorder.state === 'recording' && recorder.stop()
    console.log(recorder.state)
  }

  const save = () => {
    recorder && recorder.state === 'inactive' && 
    console.log(recorder.state)
    // console.log(chunk)
    console.log(blob)

    const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    // const audios = this.state.audios.concat([audioURL]);

    console.log(audioURL)
  }

  const upload = () => {
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


  return (
    <div>
      {/* <h2>Recorder</h2> */}
      <Word />
      <div>{info}</div>
      {/* <div>{status}</div> */}
      {status === 'stop'?
        <button onClick={start}>start</button>
      : status === 'start'?
        <button onClick={stop}>stop</button>
      :
        <button disabled={true} onClick={stop}>stop</button>
      }
      {/* <button disabled={!link}><a href={link}>download</a></button>
      <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder