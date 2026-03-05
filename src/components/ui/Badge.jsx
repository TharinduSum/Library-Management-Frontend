import React from 'react'

export const Badge = ({ variant = 'default', children, className = '' }) => {
  const variantClass = `badge badge-${variant}`
  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
