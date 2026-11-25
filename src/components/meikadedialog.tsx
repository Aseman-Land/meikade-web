
import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogProps, IconButton } from '@mui/material';
import { ReactNode } from 'react';
import MeikadeDialogTitle from './meikadedialogtitle';

export type MeikadeDialogProps = {
    titleObjects?: ReactNode,
    noPadding?: boolean,
    closeColor?: string,
} & DialogProps;

const MeikadeDialog = (props: MeikadeDialogProps) => {

    return <Dialog
        {...props}
        slotProps={{
            paper: {
                sx: {
                    padding: props.noPadding ? '0px' : 'none',
                    margin: props.noPadding ? '10px' : 'none',
                }
            }
        }}
    >
        {(props.title || props.titleObjects) && <MeikadeDialogTitle>
            {props.title}
            {props.titleObjects}
        </MeikadeDialogTitle>}
        <DialogContent
            sx={{
                padding: props.noPadding ? '0px' : 'none',
                margin: props.noPadding ? '0px' : 'none',
            }}
        >
            {props.children}
        </DialogContent>
        <IconButton
            onClick={() => {
                if (props.onClose)
                    props.onClose({}, "escapeKeyDown");
            }}
            sx={{
                position: "absolute",
                right: 8,
                top: 8
            }}
        >
            <Close sx={{ color: props.closeColor }} />
        </IconButton>
    </Dialog>;
}

export default MeikadeDialog;
