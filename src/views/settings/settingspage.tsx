import { Close, Password, Style } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeDrawer from '../../components/meikadedrawer';
import { globalBorderRadius, theme } from '../../utils/theme';
import DeleteAccount from './deleteaccount';
import PasswordChanger from './passwordchange';
import ThemeSwitcher from './themeswitcher';

const SettingsPage = () => {
    const { t } = useTranslation();

    const [currentTheme, setCurrentTheme] = React.useState<string>(localStorage.getItem("theme") ?? "automatic");
    const [themeDialog, setThemeDialog] = React.useState<boolean>(false);
    const [passwordDialog, setPasswordDialog] = React.useState<boolean>(false);
    const [deleteAccountDialog, setDeleteAccountDialog] = React.useState<boolean>(false);

    return <Container maxWidth="sm">
        <MeikadeAppBar
            enableBackButton
        />
        <Box
            sx={{
                marginTop: '75px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: globalBorderRadius,
                    padding: '20px 20px',
                }}
            >
                <Typography variant='h6'>{t('settings.theme')}</Typography>
                <Button
                    variant='outlined'
                    onClick={() => setThemeDialog(true)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        alignItems: 'center',
                    }}
                >
                    <Style />
                    {t('setup.steps.step_theme.themes.' + currentTheme)}
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: globalBorderRadius,
                    padding: '20px 20px',
                }}
            >
                <Typography variant='h6'>{t('settings.password.title')}</Typography>
                <Button
                    variant='outlined'
                    onClick={() => setPasswordDialog(true)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        alignItems: 'center',
                    }}
                >
                    <Password />
                    {t('settings.password.change')}
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: globalBorderRadius,
                    padding: '20px 20px',
                }}
            >
                <Typography variant='h6'>{t('settings.delete-account.title')}</Typography>
                <Button
                    variant='outlined'
                    onClick={() => setDeleteAccountDialog(true)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        alignItems: 'center',
                    }}
                >
                    <Close />
                    {t('settings.delete-account.delete')}
                </Button>
            </Box>
        </Box>

        <MeikadeDrawer
            open={themeDialog}
            onClose={() => setThemeDialog(false)}
            anchor='bottom'
            title={t('settings.theme')!}
        >
            <ThemeSwitcher
                onThemeChanged={(tm: string) => {
                    setCurrentTheme(tm);
                    setThemeDialog(false);
                    window.location.href = window.location.pathname;
                }}
            />
        </MeikadeDrawer>

        <MeikadeDrawer
            open={passwordDialog}
            onClose={() => setPasswordDialog(false)}
            anchor='bottom'
            title={t('settings.password.title')!}
        >
            <PasswordChanger
                onPasswordChanged={() => {
                    setPasswordDialog(false);
                }}
            />
        </MeikadeDrawer>

        <MeikadeDrawer
            open={deleteAccountDialog}
            onClose={() => setDeleteAccountDialog(false)}
            anchor='bottom'
            title={t('settings.delete-account.title')!}
        >
            <DeleteAccount
                onAccountDeleted={() => {
                    setDeleteAccountDialog(false);
                    window.location.href = '/';
                }}
            />
        </MeikadeDrawer>
    </Container>
}

export default SettingsPage;