import { Add, InfoOutlined, Login, Support, VolunteerActivismOutlined } from '@mui/icons-material';
import { alpha, Box, Button, CircularProgress, Container, Divider, ListItemIcon, Menu, MenuItem, Tab, Tabs } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import MeikadeAppBar from '../../components/meikadeappbar';
import SimpleContentCard from '../../components/simplecontentcard';
import { showAddMenu, showSignInDialog } from '../../layouts/mainframe';
import { MkFullContent } from '../../models/content';
import { MkContentServices } from '../../services/content';
import * as UserGlobal from "../../services/user-global";
import { globalBorderRadius, theme } from '../../utils/theme';
import TreasureLists from '../treasure/treasurelists';
import { DefaultSignInDialog } from '../user/signin';


const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const mostViewedTab: number = 0;
    const feedTab: number = 1;
    const treasureTab: number = 2;

    const limit: number = 50;

    var currentTabPos = 0;
    const pos = parseInt(localStorage.getItem('current_tab') ?? mostViewedTab.toString());
    if (!isNaN(pos))
        currentTabPos = pos;
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [contents, setContents] = React.useState<Array<MkFullContent>>([]);
    const [hasMore, setHasMore] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const [currentTab, setCurrentTab] = React.useState<number>(currentTabPos);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const reloadTimeline = () => {
        if (currentTab == feedTab)
            reload(0)
        else
            setCurrentTab(feedTab)
    }

    const more = () => {
        reload(contents.length);
    }

    const reload = async (offset: number) => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        if (offset == 0)
            setContents([]);
        try {
            var list: Array<MkFullContent> = [];
            switch (currentTab) {
                case mostViewedTab: {
                    const result = await MkContentServices.topViewed({
                        type_code: 'poem',
                        limit: limit,
                        poet_id: null,
                        book_id: null,
                        legacy_type_id: null,
                        offset: offset,
                    });
                    if (result.status && result.result) {
                        list = result.result;
                        setHasMore(result.result.length == limit);
                    }
                }
                    break;

                case feedTab: {
                    const result = await MkContentServices.feed({
                        limit: limit,
                        offset: offset,
                        show_verses: true,
                    });
                    if (result.status && result.result) {
                        list = result.result;
                        setHasMore(result.result.length == limit);
                    }
                }
                    break;
            }
            setContents(offset > 0 ? [...contents, ...list] : list);
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    React.useEffect(() => {
        localStorage.setItem('current_tab', currentTab.toString());
        reload(0);
    }, [currentTab])

    return <Container maxWidth="sm">
        <MeikadeAppBar
            enableMenuButton
            onMenuClick={handleMenuOpen}
        >
            <Tabs
                variant='fullWidth'
                value={currentTab}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                    setCurrentTab(newValue);
                }}
                centered
                sx={{
                    width: '100%',
                    maxWidth: 'sm',
                }}
            >
                <Tab value={0} label={t('home.top')} />
                <Tab value={1} label={t('home.followings')} />
                <Tab value={2} label={t('home.poets')} />
            </Tabs>
        </MeikadeAppBar>

        <Box
            sx={{
                marginTop: '120px',
                paddingBottom: '200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            {(currentTab == feedTab || currentTab == mostViewedTab) && <>
                {/* {isLoading && } */}
                {contents.map((content: MkFullContent, index: number) => (
                    <SimpleContentCard
                        contentItem={content}
                        onReloadRequest={() => {
                            reloadTimeline();
                        }}
                    />
                ))}
                <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: contents.length == 0 ? '40% 0px' : '20px 10px' }} id="busy" />}
                </Box>
            </>}
            {currentTab == treasureTab && <TreasureLists />}
        </Box>

        {UserGlobal.user && <>
            <Button
                sx={{
                    position: 'fixed',
                    zIndex: 10,
                    bottom: '90px',
                    marginLeft: '-8px',
                    height: '54px',
                    width: '54px',
                    padding: 'unset',
                    minWidth: 'unset',
                    borderRadius: '50px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                    backdropFilter: 'blur(8px)',
                }}
                onClick={() => showAddMenu(null, reloadTimeline)}
            >
                <Add />
            </Button>
        </>}
        <DefaultSignInDialog autoMode />

        <Menu
            anchorEl={menuAnchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            slotProps={{
                paper: {
                    sx: {
                        mt: '2px',
                        mr: '-5px',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: globalBorderRadius,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
        >
            {!UserGlobal.user && <>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        showSignInDialog();
                    }}
                >
                    <ListItemIcon>
                        <Login fontSize="small" />
                    </ListItemIcon>
                    {t('auth.signin')}
                </MenuItem>
                <Divider />
            </>}
            <MenuItem onClick={() => { handleMenuClose(); navigate('/donate'); }}>
                <ListItemIcon>
                    <VolunteerActivismOutlined fontSize="small" />
                </ListItemIcon>
                {t('donate')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => {
                handleMenuClose();
                window.open("https://t.me/poshtibanimoon", '_blank', 'noopener,noreferrer');
                // window.location.href = "mailto:contact@aseman.io";
            }}>
                <ListItemIcon>
                    <Support fontSize="small" />
                </ListItemIcon>
                {t('support')}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/about'); }}>
                <ListItemIcon>
                    <InfoOutlined fontSize="small" />
                </ListItemIcon>
                {t('about')}
            </MenuItem>
        </Menu>
    </Container>
}

export default Home;