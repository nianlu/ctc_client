import React, { useState, useEffect } from 'react';

const words = [
  {pinyin: 'kāng', charactor: '康'},
  {pinyin: 'dǐng', charactor: '顶'},
  {pinyin: 'gàng', charactor: '杠'},
]

const Word = (props) => {

  const [ word, setWord ] = useState(words[0])

  const random = max => Math.floor(Math.random() * Math.floor(max));

  return (
    <div onClick={_ => setWord(words[random(3)])} style={{cursor: 'pointer'}}>
      <div style={{fontSize: '5rem'}}>{word.pinyin}</div>
      <div style={{fontSize: '11rem', fontFamily: 'KaiTi KaiTi_GB2312'}}>{word.charactor}</div>
    </div>
  )
}

export default Word
