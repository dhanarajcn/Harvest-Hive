/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { HTMLInputTypeAttribute } from "react";

interface InputProps {
    width?: string;
    height?: string;
    margin?: string;
    type?: HTMLInputTypeAttribute;
    placeholder?: string;
    value?: string | number;
    color: string,
    highlightColor: string,
    min?: string,
    disabled?: boolean,
    onChange?: (value: string) => void;
};

export default function Input(props: InputProps) {
    return (
        <div
            css={{
                width: props.width,
                margin: props.margin ?? "0px",
                position: "relative",
                height: props.height ?? "60px",
                overflow: "hidden",
                flexGrow: "1",
            }}>
            <input
                id="input"
                css={{
                    fontSize: "16px",
                    paddingTop: "15px",
                    width: "calc(100% - 4px)",
                    height: "100%",
                    background: "transparent",
                    color: props.color,
                    border: "none",
                    outline: "none",
                    '&:focus': {
                        color: props.highlightColor,
                    },
                    '&:valid': {
                        color: props.highlightColor,
                    },
                    '&:disabled': {
                        color: props.highlightColor,
                    },
                    '&:disabled + label span': {
                        transform: "translateY(-150%)",
                        fontSize: "14px",
                        color: props.highlightColor,
                    },
                    '&:focus + label span': {
                        transform: "translateY(-150%)",
                        fontSize: "14px",
                        color: props.highlightColor,
                    },
                    '&:valid + label span': {
                        transform: "translateY(-150%)",
                        fontSize: "14px",
                        color: props.highlightColor,
                    },
                    '&:focus + label::after': {
                        transform: "translateX(0%)",
                    },
                    '&:valid + label::after': {
                        transform: "translateX(0%)",
                    },
                }}
                type={props.type}
                value={props.value}
                min={props.min}
                required={true}
                autoComplete={"off"}
                spellCheck={false}
                disabled={props.disabled}
                onChange={(e) => {
                    props.onChange?.(e.target.value);
                }}
            />
            <label
                htmlFor='input'
                css={{
                    position: "absolute",
                    bottom: "0px",
                    left: "0%",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    borderBottom: `1px solid ${props.color}`,
                    color: props.color,
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        left: "0px",
                        bottom: "-1px",
                        height: "100%",
                        width: "100%",
                        borderBottom: `3px solid ${props.highlightColor}`,
                        transform: "translateX(-100%)",
                        transition: "transform 0.3s ease",
                    }
                }}>
                <span css={{
                    position: "absolute",
                    bottom: "0px",
                    left: "0px",
                    transition: "all 0.3s ease",
                }}>{props.placeholder}</span>
            </label>
        </div>
    )
}