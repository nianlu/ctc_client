import React, { useState, useEffect } from 'react';

const Intro = (props) => {

  const { toStep } = props

  return (
    <div>
      <h2>Introduction</h2>
      <div>here are some intro...</div>
      <button onClick={_ => toStep('confirm')}>next</button>
    </div>
  )
}

export default Intro