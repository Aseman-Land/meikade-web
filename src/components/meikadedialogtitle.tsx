
import { DialogTitle, DialogTitleProps } from '@mui/material';

export type MeikadeDialogTitleProps = {
} & DialogTitleProps;

const MeikadeDialogTitle = (props: MeikadeDialogTitleProps) => {

    return <DialogTitle
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '3px',
            alignItems: 'center',
            padding: '6px 26px 6px 12px',
            width: '100%',
            ...props.sx,
        }}
    >
        {props.children}
    </DialogTitle>;
}

export default MeikadeDialogTitle;
