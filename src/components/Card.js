import React from 'react'

export const CardNumber = ({ number }) => {
  const width = number === 100 ? 80 : number > 9 ? 56 : 48
  const center = width / 2

  return <svg className='w-full max-h-full' viewBox={`0 0 ${width} 56`}>
    <text alignmentBaseline='central' textAnchor='middle' x={center} y='28'>{number}</text>
  </svg>
}

export const Card = ({ isSelected, value, onClick = e => {}, styles = {}, classes }) => {
  if (!value) return null

  return <div
    className={`card-grid card-base ${classes}`}
    style={styles}
    onClick={onClick}
  >
    <span className='flex justify-center items-start' style={{ gridArea: 'top-left' }}>
      <CardNumber number={value} />
    </span>
    <span className='flex-center px-2 md:px-4' style={{ gridArea: 'center' }}>
      <CardNumber number={value} />
    </span>
    <span className='flex justify-center items-start' style={{ gridArea: 'bottom-right', transform: 'rotate(180deg)' }}>
      <CardNumber number={value} />
    </span>
  </div>
}
