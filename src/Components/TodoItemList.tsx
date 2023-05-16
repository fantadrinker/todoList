// renders a list of items, accepts an array of items as props

import React from 'react';

interface TodoItemListProps {
    title: string;
    items: Array<{id: number, value: string, completed: boolean}>;
    onChange: (id: number, completed: boolean) => void;
}

export const TodoItemList: React.FC<TodoItemListProps> = ({
    title,
    items,
    onChange,
}) => {
    return (
        <div style={{
            width: '375px',
            textAlign: 'left',
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "5px",
        }}>
            <h2 style={{
                borderBottom: "1px solid white",
                paddingLeft: "20px"
            }}>
                {title}
            </h2>
            <ul style={{
                listStyle: "none"
            }}>
                {items.length === 0? <p>Nothing to do</p>: null}
                {items.map((item) => (
                    <li key={item.id} style={{fontSize: "18px"}}>
                        <input 
                            type="checkbox" 
                            style={{
                                marginRight: "10px",
                                height: "20px",
                                width: "20px",
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
}
