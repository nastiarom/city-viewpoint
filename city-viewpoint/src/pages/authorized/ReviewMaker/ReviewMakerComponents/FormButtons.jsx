import React from 'react';

export function ToggleButton({ selected, onClick, children, className }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} ${selected ? "selected" : ""}`}
        >
            {children}
        </button>
    );
}

export function SingleSelectButton({ selected, onClick, children, className }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} ${selected ? "selected" : ""}`}
        >
            {children}
        </button>
    );
}