import PropTypes from 'prop-types';
import css from './FormErrorMessages.module.css';

export const FormErrorMessages = ({ children, className}) => (
    <div className={`${css.errorMessage} ${className}`}>{children}</div>
);

FormErrorMessages.PropTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}