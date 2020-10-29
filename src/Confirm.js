import React, { useState, useEffect } from 'react';
import { testget, testUpload } from './api';

const Confirm = (props) => {

  const { toStep } = props

  return (
    <div>
      <h2>Confirmation</h2>
      <div>please confirm</div>
      <button onClick={_ => toStep('recorder')}>non-native</button>
      <button onClick={_ => toStep('recorder')}>native</button>
    </div>
  )
}

export default Confirm