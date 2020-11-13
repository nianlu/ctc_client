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
            {'User-Id': user.uid, 'File-Name': 'test', 'File-Group': user.group, 'File-Type': e.data.type},
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

  const onStart = () => {
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
      {/* <button disabled={!link}><a href={link}>download</a></button>
      <button disabled={!link} onClick={upload}>upload</button> */}
    </div>
  )
}

export default Recorder