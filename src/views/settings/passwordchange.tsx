
import { Check } from '@mui/icons-material';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { BoxProps } from '@mui/system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MkUserUpdate } from '../../models/user';
import { MkUserServices } from '../../services/user';
import { hashPassword } from '../../utils/auth';
import { sleep } from '../../utils/tools';

export type PasswordChangerProps = {
    disableCurrent?: boolean,
    onPasswordChanged?: () => void,
} & BoxProps;

const PasswordChanger = (props: PasswordChangerProps) => {
    const { t } = useTranslation();

    const [passwordCurrent, setPasswordCurrent] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = React.useState<string>('');

    const loadingRef = React.useRef<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const submit = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const req: MkUserUpdate = {
                firstname: null,
                lastname: null,
                about: null,
                birthday: null,
                color: null,
                password: hashPassword(password),
                current_password: props.disableCurrent ? null : hashPassword(passwordCurrent),
                home: null,
                agreement: null,
                setup_version: null,
            };
            await sleep(1000);
            const res = await MkUserServices.edit(req);
            if (res.status && res.result) {
                if (props.onPasswordChanged)
                    props.onPasswordChanged();
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
        {isLoading && <CircularProgress sx={{ 'margin': '100px 0px' }} id="busy" />}
        {!isLoading && <>
            <Typography
                sx={{
                    textAlign: 'justify',
                }}
            >
                {t('settings.password.description')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                }}
            >
                {!props.disableCurrent && <TextField
                    name="password"
                    autoComplete="password"
                    fullWidth
                    label={t('settings.password.current')}
                    required
                    type="password"
                    sx={{
                        direction: 'ltr',
                    }}
                    value={passwordCurrent}
                    onChange={(event) => {
                        setPasswordCurrent(event.target.value);
                    }}
                />}
                <TextField
                    name="password"
                    autoComplete="password"
                    fullWidth
                    label={t('settings.password.new')}
                    required
                    type="password"
                    sx={{
                        direction: 'ltr',
                    }}
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <TextField
                    name="password"
                    autoComplete="password"
                    fullWidth
                    label={t('settings.password.repeat')}
                    required
                    type="password"
                    sx={{
                        direction: 'ltr',
                    }}
                    value={passwordRepeat}
                    onChange={(event) => {
                        setPasswordRepeat(event.target.value);
                    }}
                />
            </Box>
            <Button
                fullWidth
                variant='outlined'
                disabled={password.length < 6 || (!props.disableCurrent && passwordCurrent.length == 0) || password != passwordRepeat}
                sx={{
                    minHeight: '46px',
                }}
                onClick={submit}
            >
                <Check />
                {t('settings.password.change')}
            </Button>
        </>}
    </Box>
}

export default PasswordChanger;
