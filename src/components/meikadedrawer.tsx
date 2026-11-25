
import { Close } from '@mui/icons-material';
import { DialogContent, DialogTitle, Drawer, DrawerProps, IconButton } from '@mui/material';

export type MeikadeDrawerProps = {
    nonClosable?: boolean,
} & DrawerProps;

const MeikadeDrawer = (props: MeikadeDrawerProps) => {

    return <Drawer
        {...props}
        onClose={(e, r) => {
            if (props.nonClosable)
                return;

            if (props.onClose)
                props.onClose(e, r);
        }}
        slotProps={{
            paper: {
                sx: {
                    maxHeight: 'calc(100% - 50px)',
                    paddingBottom: '10px',
                }
            }
        }}
    >
        {props.title && <DialogTitle
            sx={{
                position: 'relative',
                padding: '18px 26px',
            }}
        >
            {props.title}
        </DialogTitle>}
        <DialogContent>
            {props.children}
        </DialogContent>
        {!props.nonClosable && <IconButton
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
            <Close />
        </IconButton>}
    </Drawer>;
}

export default MeikadeDrawer;
