import React from 'react';

/**
 *
 * This is the TodoItemList component. It accepts an array of items as props
 * and renders them as a list. It also accepts a callback function to handle
 * changes to the items.
 *
 * Not a big fan of passing the onChange function as a prop in general, but
 * at this scale it is not a big deal and I can save some time.
 */

interface TodoItemListProps {
  title: string;
  items: Array<{ id: number; value: string; completed: boolean }>;
  onChange: (id: number, completed: boolean) => void;
}

export const TodoItemList: React.FC<TodoItemListProps> = ({
  title,
  items,
  onChange,
}) => {
  return (
    <div
      style={{
        width: '375px',
        textAlign: 'left',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '5px',
      }}
    >
      <h2
        style={{
          borderBottom: '1px solid white',
          paddingLeft: '20px',
        }}
      >
        {title}
      </h2>
      <ul
        style={{
          listStyle: 'none',
        }}
      >
        {items.length === 0 ? <p>Nothing to do</p> : null}
        {items.map((item) => (
          <li key={item.id} style={{ fontSize: '18px' }}>
            <input
              type="checkbox"
              style={{
                marginRight: '10px',
                height: '20px',
                width: '20px',
              }}
              checked={item.completed}
              onChange={(event) => onChange(item.id, event.target.checked)}
            />
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};
