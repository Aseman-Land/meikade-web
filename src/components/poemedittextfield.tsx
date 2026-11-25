import { Box, Typography } from '@mui/material';
import { alpha, BoxProps } from '@mui/system';
import React, { useEffect, useRef } from 'react';
import { theme } from '../utils/theme';
import { PoemIconAlignmentType } from './poemicon';

export type ZigZagTextFieldProps = {
    value?: string;
    onValueChange?: (val: string) => void;
    minHeight?: number | string;
    alignMode: PoemIconAlignmentType;
    placeholder?: string;
} & BoxProps;

export const PoemEditTextField = (props: ZigZagTextFieldProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastKnownValue = useRef(props.value);

    const [text, setText] = React.useState<string>(props.value ?? '');

    const textToHtml = (text: string) => {
        if (!text) return '<div><br></div>';
        return text
            .split('\n')
            .map((line) => `<div>${line || '<br>'}</div>`)
            .join('');
    };

    const extractText = (node: HTMLDivElement) => {
        const lines: string[] = [];
        node.childNodes.forEach((child) => {
            if (child.nodeName === 'DIV' || child.nodeName === 'P') {
                lines.push(child.textContent || '');
            } else if (child.nodeType === Node.TEXT_NODE) {
                lines.push(child.textContent || '');
            }
        });
        return lines.join('\n');
    };

    useEffect(() => {
        if (editorRef.current && props.value && props.value !== lastKnownValue.current) {
            editorRef.current.innerHTML = textToHtml(props.value);
            lastKnownValue.current = props.value;
        }
    }, [props.value]);

    useEffect(() => {
        if (editorRef.current && props.value && !editorRef.current.innerHTML) {
            editorRef.current.innerHTML = textToHtml(props.value);
        }
    }, []);

    const handleInput = () => {
        if (!editorRef.current) return;
        const editor = editorRef.current;

        let domChanged = false;

        Array.from(editor.childNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if ((node as HTMLElement).hasAttribute('style')) {
                    (node as HTMLElement).removeAttribute('style');
                }

                if (node.nodeName !== 'DIV') {
                    const div = document.createElement('div');
                    if (node.nodeName === 'BR') {
                        div.appendChild(document.createElement('br'));
                    } else {
                        div.innerHTML = (node as HTMLElement).innerHTML || node.textContent || '';
                    }
                    editor.replaceChild(div, node);
                    domChanged = true;
                }
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                const div = document.createElement('div');
                div.textContent = node.textContent;
                editor.replaceChild(div, node);
                domChanged = true;
            }
        });

        if (domChanged) {
            try {
                const sel = window.getSelection();
                const range = document.createRange();
                const lastChild = editor.lastChild;
                if (lastChild) {
                    range.selectNodeContents(lastChild);
                    range.collapse(false);
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                }
            } catch (err) {
                console.debug(err)
            }
        }

        const plainText = extractText(editor);
        lastKnownValue.current = plainText;
        setText(plainText)
        if (props.onValueChange)
            props.onValueChange(plainText);
    };


    const handlePaste = (e: React.ClipboardEvent) => {
        if (!editorRef.current) return;

        e.preventDefault();
        const t = e.clipboardData.getData('text/plain');
        if (text.length > 0)
            editorRef.current.innerHTML += textToHtml(t);
        else
            editorRef.current.innerHTML = textToHtml(t);

        lastKnownValue.current += t;
        setText(text + t);
    };

    return (
        <Box sx={{ width: '100%' }}>
            {text.length == 0 && props.placeholder && (
                <Typography
                    sx={{
                        position: 'absolute',
                        color: alpha(theme.palette.text.primary, 0.5),
                        pointerEvents: 'none',
                        ...props.sx,
                    }}
                >
                    {props.placeholder}
                </Typography>
            )}

            <Box
                {...props}
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                sx={{
                    border: '1px solid #c4c4c4',
                    borderRadius: 1,
                    padding: '8px 12px',
                    minHeight: props.minHeight,
                    outline: 'none',
                    overflowY: 'scroll',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    backgroundColor: '#fff',
                    '&:focus': {
                        border: '2px solid #1976d2',
                        padding: '7px 11px',
                    },
                    '& > *': {
                        display: 'block',
                    },
                    '& > *:nth-child(odd)': {
                        textAlign: props.alignMode === 'rtl-poem' || props.alignMode === 'rtl' ? 'left !important' : 'right !important',
                        direction: props.alignMode === 'rtl-poem' || props.alignMode === 'rtl' ? 'ltr !important' : 'rtl !important',
                    },
                    '& > *:nth-child(even)': {
                        textAlign: props.alignMode === 'rtl-poem' || props.alignMode === 'ltr' ? 'right !important' : 'left !important',
                        direction: props.alignMode === 'rtl-poem' || props.alignMode === 'ltr' ? 'rtl !important' : 'ltr !important',
                    },
                    '& > div': {
                        minHeight: '1.5em',
                    },
                    ...props.sx,
                }}
            />
        </Box>
    );
};
