import React, { useState, useEffect } from 'react';

const Nav = (props) => {

  const { toStep } = props

  return (
    // <nav style={{backgroundColor: '#88e5f4', padding: '1rem', height: '1.5rem'}}>
    <nav className='ctc-nav'>
      <span style={{float: 'left', margin: '0.8rem', cursor: 'pointer'}} onClick={_ => toStep('intro')}>CTC</span>
      <span style={{float: 'right', margin: '0.3rem', fontSize: '0.6rem'}} >v0.1.0</span>
    </nav>
  )
}

export default Nav