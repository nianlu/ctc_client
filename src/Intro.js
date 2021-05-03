import React, { useState, useEffect } from 'react';

const Intro = (props) => {

  const { toStep } = props

  const [test, setTest] = useState(false)

  return (
    <div>
      <h2>Introduction</h2>
      <div style={{marginBottom: '1rem'}}>here are some intro...</div>
      <button className='ctc-button' onClick={_ => toStep('confirm')}
          style={{userSelect: 'none', WebkitUserSelect: 'none'}}
      >next</button>
        {/* <button className='ctc-mobile-record'
          onTouchStart={e => {e.preventDefault(); setTest(true)}}
          onTouchEnd={_ => setTest(false)}
          style={{userSelect: 'none', WebkitUserSelect: 'none'}}
        >
          {test? '...' : 'start' }
        </button> */}
    </div>
  )
}

export default Intro