import React from 'react';

import classes from './TextInput.module.css';

type TProps = NoChildren & {
  password?: boolean
  label?: string
  placeholder?: string
  value: string
  onChange: (event: React.FormEvent<HTMLInputElement>) => void
}

export const TextInput: React.FC<TProps> = ({
  onChange,
  password = false,
  value,
  label,
  placeholder,
}) => {
  return (
    <div className={classes.group}>
      {label && (
        <label className={classes.label} htmlFor={label}>
          {label}
        </label>
      )}
      <input
        className={classes.input}
        type={password ? "password" : "text"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        id={label}
      />
    </div>
  )
}
