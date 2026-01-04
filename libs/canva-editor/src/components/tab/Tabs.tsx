import React, { useState } from 'react';
import './Tabs.css';

export default ({ children }) => {
  const [selected, setSelected] = useState(0);

  const buttons = (
    <div className="tabs_buttons">
      {children.map((child, index) => (
        <button
          key={index}
          className={`tab ${selected === index ? 'tab_selected' : ''}`}
          onClick={() => setSelected(index)}
        >
          {child.props.title}
        </button>
      ))}
    </div>
  );

  const content = (
    <div className="tabs_container">{children[selected].props.children}</div>
  );

  return (
    <div className="tabs_wrapper">
      {buttons}
      {content}
    </div>
  );
};
