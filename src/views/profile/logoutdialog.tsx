import { alpha, Box, BoxProps, Button, CircularProgress, Collapse, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MkUserServices } from '../../services/user';
import { theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

export type LogoutDialogProps = {
    onDissmiss?: () => void,
    onSuccessfull?: () => void,
} & BoxProps;

const LogoutDialog = (props: LogoutDialogProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const dissmiss = () => {
        if (props.onDissmiss)
            props.onDissmiss()
    }

    const doSafeLogout = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const res = await MkUserServices.logout();
            if (res) {
                if (props.onSuccessfull)
                    props.onSuccessfull();
                loadingRef.current = false;
                return;
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

    const doLogout = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            await sleep(1000);
            const res = true;
            if (res) {
                if (props.onSuccessfull)
                    props.onSuccessfull();
                loadingRef.current = false;
                return;
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

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
                    <Typography sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
                        {t('profile.logout-warn')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', alignSelf: 'end', width: '100%', justifyContent: 'space-between' }}>
                        <Button
                            variant='contained'
                            disableElevation
                            sx={{
                                background: alpha(theme.palette.text.primary, 0.7),
                            }}
                            onClick={doSafeLogout}
                        >
                            <Typography>{t('profile.safe-logout')}</Typography>
                        </Button>
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
                                onClick={doLogout}
                            >
                                <Typography>{t('profile.logout')}</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    </Box>
}

export default LogoutDialog;