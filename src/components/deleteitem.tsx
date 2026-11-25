import { alpha, Box, BoxProps, Button, CircularProgress, Collapse, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';
import { sleep } from '../utils/tools';

export type DeleteItemProps = {
    deleteMethod: () => Promise<boolean>,
    deleteMessage: string,
    onDissmiss?: () => void,
    onSuccessfull?: () => void,
} & BoxProps;

const DeleteItem = (props: DeleteItemProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const dissmiss = () => {
        if (props.onDissmiss)
            props.onDissmiss()
    }

    const deleteItem = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            await sleep(1000);
            const result = await props.deleteMethod();
            if (result) {
                if (props.onSuccessfull)
                    props.onSuccessfull();
                return;
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    return <Box
        {...props}
        sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0px 20px 10px 20px',
                width: 'calc(100% - 40px)',
            }}
        >
            <Collapse in={isLoading} timeout={300} sx={{ width: '100%' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', opacity: isLoading ? 1 : 0 }}>
                    <CircularProgress sx={{ alignSelf: 'center', margin: '20px 0px 20px 0px' }} id="busy" />
                </Box>
            </Collapse>
            <Collapse in={!isLoading} timeout={300} sx={{ width: '100%' }}>
                <Box

                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {props.deleteMessage}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', alignSelf: 'end' }}>
                        <Button
                            variant='contained'
                            disableElevation
                            sx={{
                                background: alpha(theme.palette.text.primary, 0.1),
                                color: theme.palette.text.primary,
                            }}
                            onClick={dissmiss}
                        >
                            <Typography>{t('mainframe.content-menu.cancel')}</Typography>
                        </Button>
                        <Button
                            variant='contained'
                            disableElevation
                            onClick={deleteItem}
                        >
                            <Typography>{t('mainframe.content-menu.delete')}</Typography>
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    </Box>
}

export default DeleteItem;