import React from 'react'

export const Input = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || props.name
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
