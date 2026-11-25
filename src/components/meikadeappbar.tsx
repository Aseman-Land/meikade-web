import { ChevronRight, MoreVert, SearchOutlined } from '@mui/icons-material';
import { AppBar, AppBarProps, ButtonBase, IconButton, Toolbar } from '@mui/material';
import { alpha, Box } from '@mui/system';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { globalBorderRadius, theme } from '../utils/theme';
import MeikadeLogo from './meikadelogo';

export type MeikadeAppBarProps = {
    enableBackButton?: boolean,
    disableDivider?: boolean,
    hideLogo?: boolean,
    hideToolbar?: boolean,
    enableSearchButton?: boolean,
    onSearchButtonClick?: () => void,
    enableMenuButton?: boolean,
    onMenuClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
} & AppBarProps;

const defaultHeight: string = "65px";
let lastHeight_cache: number | null = null;
let lastToolBarOpacity_cache: number = 1;

export default function MeikadeAppBar(props: MeikadeAppBarProps) {
    const navigate = useNavigate();

    const boxRef = React.useRef<HTMLDivElement>(null);
    const [lastHeight, setLastHeight] = React.useState<string>(lastHeight_cache ? `${lastHeight_cache}px` : defaultHeight);
    const [toolBarOpacity, setToolBarOpacity] = React.useState<number>(lastToolBarOpacity_cache);
    const [opacity, setOpacity] = React.useState<number>(0);

    const loadHeight = () => {
        const newHeight: number = (boxRef.current ? boxRef.current.getBoundingClientRect().height : 0);
        setLastHeight(`${(lastHeight_cache ?? newHeight)}px`);

        lastToolBarOpacity_cache = props.hideToolbar ? 0 : 1;
        setToolBarOpacity(lastToolBarOpacity_cache);

        setTimeout(() => {
            lastHeight_cache = newHeight;
            setLastHeight(`${newHeight}px`);
            setTimeout(() => setOpacity(1), 200);
        }, 10);
    }

    React.useEffect(() => {
        loadHeight();
    }, [props.children]);

    return (
        <AppBar
            sx={{
                ...props.sx,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: lastHeight,
                transition: 'height 0.2s ease-in-out',
                overflow: 'hidden',
                justifyContent: 'start',
                borderBottom: props.disableDivider ? 'unset' : `1px solid ${alpha(theme.palette.text.primary, 0.11)}`,
            }}
            variant='outlined'
            color='default'
        >
            <Box
                ref={boxRef}
                sx={{
                    position: 'fixed',
                    top: '0px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 'sm',
                }}
            >
                {!props.hideToolbar && <Toolbar disableGutters
                    sx={{
                        width: '100%',
                        maxWidth: 'sm',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'opacity 0.2s ease-in-out',
                        opacity: toolBarOpacity,
                    }}
                >
                    {props.enableSearchButton && <IconButton
                        sx={{
                            position: 'absolute',
                            right: props.enableMenuButton ? '64px' : globalBorderRadius,

                        }}
                        onClick={() =>
                            props.onSearchButtonClick?.()}
                    >
                        <SearchOutlined />
                    </IconButton>}
                    {props.enableMenuButton && <IconButton
                        sx={{
                            position: 'absolute',
                            right: globalBorderRadius
                        }}
                        onClick={(event) => props.onMenuClick?.(event)}
                    >
                        <MoreVert />
                    </IconButton>}
                    {props.enableBackButton && <IconButton
                        sx={{
                            position: 'absolute',
                            left: globalBorderRadius
                        }}
                        onClick={(event) => navigate(-1)}
                    >
                        <ChevronRight />
                    </IconButton>}
                    {!props.hideLogo && <ButtonBase
                        component={RouterLink}
                        to='/'
                        sx={{
                            display: 'flex',
                            margin: '0 auto'
                        }}
                    >
                        <MeikadeLogo width='52px' height='52px' />
                    </ButtonBase>}
                </Toolbar>}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 'sm',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'opacity 0.2s ease-in-out',
                        opacity: opacity,
                    }}
                >
                    {props.children}
                </Box>
            </Box>
        </AppBar>
    )
}
