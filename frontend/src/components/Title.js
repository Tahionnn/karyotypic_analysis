import React, { useState, useEffect } from 'react';
import styles from "../App.css";

const Title = ({ value, onChange }) => {
  const [title, setTitle] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      setTitle(value);
    }, [value]);

  const handleChange = (event) => {
    setTitle(event.target.value);
    onChange(event.target.value);
  };

  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div style={{ borderBottom: '1px solid rgb(218, 220, 224)', width: '100%' }}>
      {isEditing ? (
        <textarea
          className="title"
          rows="1"
          cols="30"
          value={title}
          onChange={handleChange}
          onBlur={handleClick}
          placeholder="Введите ваш Title здесь..."
        />
      ) : (
        <div onClick={handleClick}>
          <h1 className="title">{title || "Your Title..."}</h1>
        </div>
      )}
    </div>
  );
};

export default Title;
