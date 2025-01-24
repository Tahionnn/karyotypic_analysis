import React, { useState, useEffect  } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownEditor = ({ value, onChange }) => {
  const [markdown, setMarkdown] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMarkdown(value);
  }, [value]);

  const handleChange = (event) => {
    setMarkdown(event.target.value);
    onChange(event.target.value);
  };

  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <h1>Комментарии к анализу</h1>
      {isEditing ? (
        <textarea
          rows="10"
          cols="50"
          value={markdown}
          onChange={handleChange}
          onBlur={handleClick}
          placeholder="Введите ваш Markdown здесь..."
        />
      ) : (
        <div onClick={handleClick}>
          <ReactMarkdown>{markdown || "Нажмите здесь, чтобы добавить комментарий..."}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
