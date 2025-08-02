/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';

interface MultilineInputProps {
    width?: string;
    height?: string;
    margin?: string;
    placeholder?: string;
    value?: string | number;
    color: string,
    highlightColor: string,
    disabled?: boolean,
    onChange?: (value: string) => void;
};

export default function MultilineInput(props: MultilineInputProps) {

    return (
        <div
            css={{
                width: props.width,
                margin: props.margin ?? "15px 0px 0px 0px",
                position: "relative",
                height: props.height ?? "100px",
                overflow: "hidden",
                flexGrow: "1",
            }}>
            <textarea
                id="textarea"
                css={{
                    resize: "none",
                    flex: 1,
                    border: "none",
                    fontSize: "16px",
                    outline: "none",
                    marginTop: "18px",
                    height: "calc(100% - 18px - 4px)",
                    width: "100%",
                    background: "transparent",
                    color: props.color,
                    overflowY: "auto",
                    padding: "2px 0px",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        boxShadow: `inset 0 0 5px #000000`,
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: '#000000',
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: '#000000',
                    },
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
                        top: "0px",
                        transform: "translateY(0%)",
                        fontSize: "14px",
                        color: props.highlightColor,
                    },
                    '&:valid + label span': {
                        top: "0px",
                        transform: "translateY(0%)",
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
                value={props.value}
                required={true}
                autoComplete={"off"}
                spellCheck={false}
                disabled={props.disabled}
                onChange={(e) => {
                    props.onChange?.(e.target.value);
                }}
            />
            <label
                htmlFor='textarea'
                css={{
                    position: "absolute",
                    top: "0px",
                    left: "0%",
                    width: "100%",
                    height: "calc(100% - 1px)",
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
                    top: "100%",
                    left: "0px",
                    transform: "translateY(-100%)",
                    transition: "all 0.3s ease",
                }}>{props.placeholder}</span>
            </label>
        </div>
    )
}