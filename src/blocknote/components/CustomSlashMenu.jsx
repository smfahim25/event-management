import React from 'react';

export function CustomSlashMenu(props) {
  return (
    <div className="slash-menu">
      <div className="slash-menu-header">Insert</div>
      <div className="slash-menu-items">
        {props.items.map((item, index) => (
          <div
            key={index}
            className={`slash-menu-item${
              props.selectedIndex === index ? " selected" : ""
            }`}
            onClick={() => props.onItemClick?.(item)}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-title">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}