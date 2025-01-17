import React, { useState } from 'react';

const Title = ({ onChange }) => {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
    onChange(event.target.value);
  };

  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isEditing ? (
        <textarea
          rows="1"
          cols="50"
          value={title}
          onChange={handleChange}
          onBlur={handleClick}
          placeholder="Введите ваш Title здесь..."
        />
      ) : (
        <div onClick={handleClick}>
          <h1>{title || "Your Title..."}</h1>
        </div>
      )}
    </div>
  );
};

export default Title;
