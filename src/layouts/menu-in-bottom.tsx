import { useEffect, useState } from 'react';
import {Box} from '@mui/material/';
import { Paper } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Link } from "react-router-dom";
import { PersonOutline, HomeOutlined, ExploreOutlined, Search } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

type TState = {
    currentMenuValue: string
}

const MenuInBottomLayout = (props:any) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const [state, setState] = useState<TState>({ currentMenuValue: 'home' });

    useEffect(() => {
        var currentValue: string = 'home';
        switch (window.location.pathname) {
        case '/search':
            currentValue = 'search';
            break;
        case '/profile':
            currentValue = 'profile';
            break;
        case '/explore':
            currentValue = 'explore';
            break;
        }
        setState({currentMenuValue: currentValue});
    }, [state.currentMenuValue])

    const customBottomNavStyle = {
        alignSelf: 'center',
        position: 'fixed', 
        maxWidth: '500px',
        width: 'calc(100% - 20px)',
        bottom: 0, 
        left: '50%',
        transform: 'translate(-50%)',
    };

    const iconsStyle = {
        fontSize: '25px', 
        marginBottom: '4px',
    };

    return <Box sx={{ pb: 7 }}>
        <Outlet />
        <Paper sx={customBottomNavStyle} elevation={0} style={{zIndex: 1000}}>
            <BottomNavigation
                showLabels
                value={state.currentMenuValue}
                onChange={(event, newValue: string) => {
                    setState(state => ({ ...state, currentMenuValue: newValue }));
                }}>

                <BottomNavigationAction 
                    label={t('navigator.home')} 
                    defaultValue="home" 
                    value="home" 
                    icon={<HomeOutlined style={iconsStyle} />} 
                    component={Link} 
                    to="/" 
                />

                <BottomNavigationAction 
                    label={t('navigator.search')} 
                    value="search" 
                    icon={<Search style={iconsStyle} />} 
                    component={Link} 
                    to="/search" 
                />

                <BottomNavigationAction 
                    label={t('navigator.explore')} 
                    value="explore" 
                    icon={<ExploreOutlined style={iconsStyle} />} 
                    component={Link} 
                    to="/explore"
                />

                <BottomNavigationAction 
                    label={t('navigator.profile')} 
                    value="profile" 
                    icon={<PersonOutline style={iconsStyle} />} 
                    component={Link} 
                    to="/profile" 
                />
            </BottomNavigation>
        </Paper>
    </Box>
}

export default MenuInBottomLayout

