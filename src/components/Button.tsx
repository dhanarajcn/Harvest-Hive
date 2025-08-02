/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { CSSProperties, MouseEventHandler } from 'react';

interface ButtonProps {
    disabled?: boolean;
    name?: string;
    color: string;
    style?: CSSProperties,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export default function Index(props: ButtonProps) {
    return (
        <button
            css={{
                position: "relative",
                minWidth: "100px",
                padding: "10px",
                alignItems: "center",
                background: "none",
                color: props.disabled ? `${props.color}22` : `${props.color}AA`,
                border: `2px solid ${props.color}77`,
                fontSize: "16px",
                outline: "none",
                cursor: "pointer",
                zIndex: "50",
                borderRadius: "10px",
                transition: "color 0.5s ease-in-out",
                ...props.style,
                '&::before': {
                    content: '""',
                    position: "absolute",
                    top: "-2px",
                    left: "-2px",
                    right: "-2px",
                    bottom: "-2px",
                    borderRadius: "10px",
                    backgroundColor: props.disabled ? `${props.color}22` : `${props.color}44`,
                    clipPath: "circle(0% at 100% 100%)",
                    transition: "clip-path 0.5s ease-in-out",
                },
                '&:hover': {
                    '&::before': {
                        clipPath: "circle(100%)",
                    },
                    color: props.disabled ? `${props.color}22` : props.color,
                    outline: "none",
                },
                '&:active': {
                    '&::before': {
                        clipPath: "circle(100%)",
                    },
                    backgroundColor: props.disabled ? `${props.color}22`: `${props.color}44`,
                    color: props.disabled ? `${props.color}22` : props.color,
                    outline: "none",
                },
            }}
            onClick={(e) => {
                if (!props.disabled && props.onClick)
                    props.onClick(e);
            }}
        >
            {props.name}
        </button>
    )
}
