import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

export type PPButtonProps = {
} & ButtonProps;

const PPButton: React.FC<PPButtonProps> = (props) => {
	var style = {
		borderRadius: '10px',
		marginTop: '10px',
		marginBottom: '10px',
		height: '46px',
		opacity: props.disabled? 0.5 : 1,
		color: (props.disabled && props.variant == 'contained'? '#fff' : props.style?.color)
    };

	const { ...rest } = props;

	return (
		<Button
			{...rest}
			sx={props.sx? {...style, ...props.sx, textTransform: 'none'} : {textTransform: 'none'}}
			style={props.style? {...style, ...props.style} : {}}
		/>
	);
};

export default PPButton;
