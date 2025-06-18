import React from "react";

export default function Button({title, onClick, isPrimary = false}: {
    title: string,
    onClick: () => void,
    isPrimary: boolean
}) {
    if (isPrimary) {
        return (
            <button
                className="bg-primary bg-[var(--primaryBtn)] text-[var(--primaryBtnTxt)] px-4 py-2 rounded-md transition-transform duration-100 active:scale-95"
                onClick={onClick}>
                {title}
            </button>
        );
    } else {
        return (
            <button
                className="bg-transparent border-2 border-[var(--primaryBtn)] text-primary px-4 py-2 rounded-md transition-transform duration-100 active:scale-95"
                onClick={onClick}>
                {title}
            </button>
        );
    }
}
