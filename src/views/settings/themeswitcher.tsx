
import { Check } from '@mui/icons-material';
import { alpha, Box, Button, Typography } from '@mui/material';
import { BoxProps } from '@mui/system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { globalBorderRadiusValue, theme } from '../../utils/theme';

export type ThemeSwitcherProps = {
    onThemeChanged?: (theme: string) => void,
} & BoxProps;

const ThemeSwitcher = (props: ThemeSwitcherProps) => {
    const { t } = useTranslation();

    const [currentTheme, setCurrentTheme] = React.useState<string>(localStorage.getItem("theme") ?? "automatic");

    const themes = [
        {
            key: "automatic",
            image: "mk_auto.png",
        },
        {
            key: "light",
            image: "mk_light.png",
        },
        {
            key: "dark",
            image: "mk_dark.png",
        },
    ]

    const changeTheme = (tm: string) => {
        localStorage.setItem('theme', tm);
        setCurrentTheme(tm);
        if (props.onThemeChanged)
            props.onThemeChanged(tm);
    }

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxHeight: 'calc(100dvh - 300px)',
            minHeight: '300px',
            overflowY: 'scroll',
            gap: '10px',
        }}
    >
        {themes.map((tm) => (
            <Button
                fullWidth
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '20px',
                    alignItems: 'center',
                    justifyContent: 'start',
                    color: 'unset',
                    height: 'unset',
                    background: tm.key == currentTheme ? alpha(theme.palette.text.primary, 0.1) : 'transparent',
                }}
                onClick={() => changeTheme(tm.key)}
            >
                <Box
                    sx={{
                        background: `url(/assets/images/${tm.image})`,
                        backgroundSize: "cover",
                        width: '50px',
                        height: '50px',
                        minWidth: '50px',
                        minHeight: '50px',
                        borderRadius: `${globalBorderRadiusValue / 2}px`,
                    }}
                />
                <Typography
                    sx={{
                        fontWeight: tm.key == currentTheme ? 700 : 500,
                        width: '100%',
                        textAlign: 'start',
                    }}
                >
                    {t('setup.steps.step_theme.themes.' + tm.key)}
                </Typography>
                {tm.key == currentTheme && <Check sx={{ margin: '0px 12px' }} />}
            </Button>
        ))}
    </Box>
}

export default ThemeSwitcher;
