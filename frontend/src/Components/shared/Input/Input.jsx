import React from "react";
import styles from './Input.module.css'

const Input = ({ props }) => {
  return <div>
    <input className={styles.input} type="text" {...props} />
  </div>;
};

export default Input;
