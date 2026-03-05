import React from 'react'

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClass = size === 'lg' ? 'spinner-lg' : ''
  return <div className={`spinner ${sizeClass} ${className}`} />
}

export default Spinner
