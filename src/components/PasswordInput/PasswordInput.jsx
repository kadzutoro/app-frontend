import css from './PasswordInput.module.css';
import icons from '../../images/icons.svg';
import { FormErrorMessages } from '../FormErrorMessages/FormErrorMessages';
import { useId, useState } from 'react';
import clsx from 'clsx';

export const PasswordInput = ({
  placeholder,
  ariaLabel,
  required,
  errors,
  register,
  className,
  ...props
}) => {
  const PasswordInputId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const handleShowOrHidePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={css.wrapperBox}>
      <label className={css.container} htmlFor={PasswordInputId}>
        <input
          className={clsx(css.input, className)}
          type={showPassword ? 'text' : 'password'}
          autoComplete="off"
          id={PasswordInputId}
          placeholder={placeholder}
          aria-label={ariaLabel}
          {...register('password', {
            required: required ? 'this field is required' : false,
            minLength: {
              value: 64,
              message: 'The password cannot exceed 64 characters',
            },
            validate: value => !/\s/.test(value) || 'Password cannot contain spaces',
          })}
          {...props}
        />
        <button
          className={css.button}
          onClick={handleShowOrHidePassword}
          type="button"
          aria-label="Show the entered password"
        >
          <svg width={18} height={18}>
            <use
              className={showPassword ? css.iconShow : css.iconHide}
              href={`${icons}#icon-eye`}
            ></use>
          </svg>
        </button>
      </label>
      {errors?.password && (
        <FormErrorMessages className={clsx(css.errorForm)}>
          {errors.password.message}
        </FormErrorMessages>
      )}
    </div>
  );
};
