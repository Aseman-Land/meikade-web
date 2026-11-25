
import { Check } from '@mui/icons-material';
import { alpha, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { BoxProps } from '@mui/system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeDrawer from '../../components/meikadedrawer';
import { MkUserAuthenticate } from '../../models/user';
import { MkUserServices } from '../../services/user';
import { hashPassword } from '../../utils/auth';
import { theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

export type DeleteAccountProps = {
    onAccountDeleted?: () => void,
} & BoxProps;

const DeleteAccount = (props: DeleteAccountProps) => {
    const { t } = useTranslation();

    const [passwordCurrent, setPasswordCurrent] = React.useState<string>('');

    const loadingRef = React.useRef<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [warnDialog, setWarnDialog] = React.useState<boolean>(false);

    const submit = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const req: MkUserAuthenticate = {
                password: hashPassword(passwordCurrent),
            };
            await sleep(1000);
            const res = await MkUserServices.deleteMe(req);
            if (res.status && res.result) {
                if (props.onAccountDeleted)
                    props.onAccountDeleted();
                return;
            }
        } catch { }
        loadingRef.current = false;
        setIsLoading(false);
    }

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100dvh - 300px)',
            overflowY: 'scroll',
            alignItems: 'center',
            gap: '30px',
            margin: '0px 16px',
        }}
    >
        {isLoading && <CircularProgress sx={{ 'margin': '50px 0px' }} id="busy" />}
        {!isLoading && <>
            <Typography
                sx={{
                    textAlign: 'justify',
                }}
            >
                {t('settings.delete-account.description')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                }}
            >
                <TextField
                    name="password"
                    autoComplete="password"
                    fullWidth
                    label={t('settings.delete-account.password')}
                    required
                    type="password"
                    sx={{
                        direction: 'ltr',
                    }}
                    value={passwordCurrent}
                    onChange={(event) => {
                        setPasswordCurrent(event.target.value);
                    }}
                />
            </Box>
            <Button
                fullWidth
                variant='outlined'
                disabled={passwordCurrent.length == 0}
                sx={{
                    minHeight: '46px',
                }}
                onClick={() => setWarnDialog(true)}
            >
                <Check />
                {t('settings.delete-account.delete')}
            </Button>
        </>}

        <MeikadeDrawer
            title={t('settings.delete-account.title')!}
            open={warnDialog}
            onClose={() => setWarnDialog(false)}
            anchor='bottom'
        >
            <Box
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
                        gap: '20px',
                    }}
                >
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {t('settings.delete-account.final-warn')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', alignSelf: 'end' }}>
                        <Button
                            variant='contained'
                            disableElevation
                            sx={{
                                background: alpha(theme.palette.text.primary, 0.1),
                                color: theme.palette.text.primary,
                            }}
                            onClick={() => setWarnDialog(false)}
                        >
                            <Typography>{t('mainframe.content-menu.cancel')}</Typography>
                        </Button>
                        <Button
                            variant='contained'
                            disableElevation
                            onClick={() => {
                                setWarnDialog(false);
                                submit();
                            }}
                        >
                            <Typography>{t('settings.delete-account.confirm')}</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </MeikadeDrawer>

    </Box>
}

export default DeleteAccount;
