import { alpha, Box, Paper, Typography } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import * as React from 'react';
import { useState } from 'react';
import { Cookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from "react-router-dom";
import * as UserGlobal from "../services/user-global";
import { darkMode, globalBorderRadius, globalBorderRadiusValue, theme } from '../utils/theme';

const MenuInBottomIcon = (props: { icon: string, active: boolean, badge?: string }) => {

    const iconsStyle = {
        marginBottom: '5px',
        width: '22px',
        height: '22px',
        backgroundColor: theme.palette.text.primary,
        WebkitMask: `url(${props.icon}) no-repeat center / contain`,
        mask: `url(${props.icon}) no-repeat center / contain`,
        transition: 'scale 0.15s ease-in-out, margin-bottom 0.15s ease-in-out',
        scale: '0.9',
    };

    const selectedIconStyle = {
        ...iconsStyle,
        backgroundColor: darkMode ? theme.palette.text.primary : theme.palette.primary.main,
        scale: '1.2'
    };

    return <Box>
        {props.badge &&
            <Typography
                sx={{
                    position: 'absolute',
                    left: '10px',
                    top: '0px',
                    background: theme.palette.primary.main,
                    color: '#fff',
                    padding: '1px',
                    borderRadius: '50px',
                    minWidth: '20px',
                    minHeight: '20px',
                    textAlign: 'center',
                    fontSize: '12px',
                }}
            >
                {props.badge}
            </Typography>
        }
        <Box sx={props.active ? selectedIconStyle : iconsStyle} />
    </Box>;
}

const MenuInBottomLayout = () => {
    const cookies = new Cookies();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const appMode: boolean = queryParams.get('appMode') == "true" || localStorage.getItem('appMode') == 'true';

    if (appMode) {
        localStorage.setItem('appMode', 'true');
    }

    const [state, setState] = useState<string>('home');
    const [highlighterPosition, setHighlighterPosition] = useState("50%");
    const [notificationsCount, setNotificationsCount] = useState<number>(UserGlobal.user?.unseen_notifications ?? 0);

    const { t } = useTranslation();

    React.useEffect(() => {
        var currentValue: string = 'home';
        let total: number = 5;
        let itemsPadd: number = 2;
        let itemsWidth: number = 96 / total;

        setHighlighterPosition((4.5 * itemsWidth + itemsPadd).toString() + '%');
        switch (window.location.pathname) {
            case '/profile':
                currentValue = 'profile';
                setHighlighterPosition((0.5 * itemsWidth + itemsPadd).toString() + '%');
                break;
            case '/notifications':
                currentValue = 'notifications';
                setHighlighterPosition((1.5 * itemsWidth + itemsPadd).toString() + '%');
                break;
            case '/search':
                currentValue = 'search';
                setHighlighterPosition((2.5 * itemsWidth + itemsPadd).toString() + '%');
                break;
            case '/explore':
                currentValue = 'explore';
                setHighlighterPosition((3.5 * itemsWidth + itemsPadd).toString() + '%');
                break;
        }
        setState(currentValue);
    }, [state, location])

    const color_transparent: string = darkMode ? '100, 100, 100' : '200, 200, 200';
    const color: string = darkMode ? '120,120,120' : '255,255,255';
    const color_shadow: string = darkMode ? '255,255,255' : '0,0,0';

    const customBottomNavStyle = {
        boxShadow:
            ' 2px  2px  0px rgba(' + color + ',1.0), ' +
            ' 2px -2px  0px rgba(' + color + ',1.0), ' +
            '-2px -2px  0px rgba(' + color + ',1.0), ' +
            '-2px  2px  0px rgba(' + color + ',1.0), ' +
            ' 0px  0px 50px rgba(' + color_shadow + ',0.1)' +
            '',
        borderRadius: globalBorderRadius,
        maxWidth: '400px',
        alignSelf: 'center',
        marginBottom: '10px',
        padding: '6px',
        height: "70px",
        position: 'fixed',
        zIndex: 10,
        width: 'calc(100% - 20px)',
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%)',
        background: 'rgba(' + color_transparent + ', 0.3)',
        backdropFilter: 'blur(8px)',
    };

    const buttonStyle = {
        fontSize: '14px',
        minWidth: 'unset',
        color: theme.palette.text.primary,
        transition: 'scale 0.15s ease-in-out',
        scale: '1',
    };

    const selectedButtonStyle = {
        ...buttonStyle,
        color: darkMode ? theme.palette.text.primary : theme.palette.primary.main,
        scale: '1',
    };

    const reloadNotificationCount = async () => {
        await UserGlobal.reloadUser();
        setNotificationsCount(UserGlobal.user?.unseen_notifications ?? 0);
    }

    React.useEffect(() => {
        if (!UserGlobal.user)
            return;

        const intervalId = setInterval(() => {
            reloadNotificationCount();
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    React.useEffect(() => {
        setNotificationsCount(UserGlobal.user?.unseen_notifications ?? 0);
    }, [UserGlobal.user]);

    return <Box>
        <Outlet />
        <Box
            sx={{
                width: '100%',
                height: '80px',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ' + theme.palette.background.default + ' 72%)',
                position: 'fixed',
                bottom: '0px',
                display: 'none',
            }}
        />
        <Paper sx={customBottomNavStyle} elevation={0}>
            <Box style={{
                width: '20%',
                height: '66px',
                background: 'linear-gradient(180deg, ' + alpha(theme.palette.background.default, 0.6) + ' 0%, ' + alpha(theme.palette.background.default, 0.2) + ' 100%)',
                position: 'absolute',
                border: '2px solid rgba(' + color + ', 0.8)',
                left: highlighterPosition,
                bottom: '2px',
                transform: 'translate(-50%)',
                borderRadius: Math.floor(globalBorderRadiusValue - 3).toString() + 'px',
                backdropFilter: 'blur(8px)',
                transition: 'left 0.15s ease-in-out',
                boxShadow: '-8px 8px 40px rgba(37, 191, 204, 0.12)',
            }}
            />
            <BottomNavigation
                showLabels
                style={{
                    background: 'transparent',
                    borderRadius: Math.floor(globalBorderRadiusValue / 2).toString() + 'px',
                    height: "64px",
                    width: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingTop: '2px',
                }}
                value={state}
                onChange={(event, newValue: string) => {
                    setState(state => (newValue));
                }}>

                <BottomNavigationAction
                    label={t('menu.home')}
                    style={state == 'home' ? selectedButtonStyle : buttonStyle}
                    defaultValue="home"
                    disableRipple
                    value="home"
                    icon={<MenuInBottomIcon icon={'/assets/images/home-icon.svg'} active={state == 'home'} />}
                    component={Link}
                    to="/"
                />
                <BottomNavigationAction
                    label={t('menu.explore')}
                    style={state == 'explore' ? selectedButtonStyle : buttonStyle}
                    value="explore"
                    disableRipple
                    icon={<MenuInBottomIcon icon={'/assets/images/explore-icon.svg'} active={state == 'explore'} />}
                    component={Link}
                    to="/explore"
                />
                <BottomNavigationAction
                    label={t('menu.search')}
                    style={state == 'search' ? selectedButtonStyle : buttonStyle}
                    value="search"
                    disableRipple
                    icon={<MenuInBottomIcon icon={'/assets/images/find-icon.svg'} active={state == 'search'} />}
                    component={Link}
                    to="/search"
                />
                <BottomNavigationAction
                    label={t('menu.notifications')}
                    style={state == 'notifications' ? selectedButtonStyle : buttonStyle}
                    value="notifications"
                    disableRipple
                    icon={<MenuInBottomIcon icon={'/assets/images/notifications-icon.svg'} active={state == 'notifications'} badge={notificationsCount > 0 ? notificationsCount.toString() : undefined} />}
                    component={Link}
                    to="/notifications"
                />
                <BottomNavigationAction
                    label={t('menu.profile')}
                    style={state == 'profile' ? selectedButtonStyle : buttonStyle}
                    value="profile"
                    disableRipple
                    icon={<MenuInBottomIcon icon={'/assets/images/profile-icon.svg'} active={state == 'profile'} />}
                    component={Link}
                    to="/profile"
                />
            </BottomNavigation>
        </Paper>
    </Box>
}

export default MenuInBottomLayout

