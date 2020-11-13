import React, { useState, useEffect } from 'react';
import { testget, testUpload } from './api';

const Confirm = (props) => {

  const { toStep, onChangeGroup } = props

  return (
    <div>
      <h2>Confirmation</h2>
      <div style={{marginBottom: '1rem'}}>please confirm</div>
      <button className='ctc-button' onClick={_ => {onChangeGroup('non-native'); toStep('recorder')}}>non-native</button>
      <button className='ctc-button' onClick={_ => {onChangeGroup('native'); toStep('recorder')}}>native</button>
    </div>
  )
}

export default Confirm