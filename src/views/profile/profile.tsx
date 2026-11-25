import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CardMembershipOutlined, Edit, InfoOutlined, Search, Support, VolunteerActivismOutlined } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import MeikadeDrawer from '../../components/meikadedrawer';
import { globalShowInfoMessage } from '../../layouts/mainframe';
import { MkFullInvitation } from '../../models/invitations';
import { MkInvitationsServices } from '../../services/invitations';
import * as UserGlobal from "../../services/user-global";
import { globalBorderRadius } from '../../utils/theme';
import EditProfile from '../user/editprofile';
import { DefaultSignInDialog } from '../user/signin';
import { UserPageBase, UserPageBaseRef } from '../user/userpage';
import LogoutDialog from './logoutdialog';

const ProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cookies = new Cookies();

    const [editDialog, setEditDialog] = React.useState(false);
    const [logoutDialog, setLogoutDialog] = React.useState<boolean>(false);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [invitationCode, setInvitationCode] = React.useState<MkFullInvitation>();
    const isMenuOpen = Boolean(menuAnchorEl);

    const baseRef = React.useRef<UserPageBaseRef>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const copyInvitationCode = async () => {
        if (!invitationCode)
            return;

        try {
            await navigator.clipboard.writeText(invitationCode.code);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        handleMenuClose();
        globalShowInfoMessage(t('messages.info.copied'));
    };

    const reloadInvitationCode = async () => {
        if (!UserGlobal.user)
            return;

        try {
            const result = await MkInvitationsServices.getMyCode();
            if (result.status && result.result)
                setInvitationCode(result.result);
        } catch { }
    }

    React.useEffect(() => {
        reloadInvitationCode();
    }, []);

    return <Box>
        <UserPageBase
            ref={baseRef}
            user_id={UserGlobal.userId.toString()}
            onMenuRequest={handleMenuOpen}
            profilePage
        />
        <DefaultSignInDialog open={UserGlobal.user ? false : true} autoMode onClose={() => navigate('/')} />

        <MeikadeDrawer
            open={logoutDialog}
            title={t('profile.logout-title')!}
            onClose={() => setLogoutDialog(false)}
            anchor="bottom"
        >
            <LogoutDialog
                onDissmiss={() => {
                    setLogoutDialog(false)
                }}
                onSuccessfull={() => {
                    cookies.remove('token', { path: '/' });
                    window.location.href = '/';
                }}
            />
        </MeikadeDrawer>

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
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    const user = UserGlobal.user;
                    if (user) {
                        navigate(`/user/${user.username}/search`);
                    }
                }}
            >
                <ListItemIcon>
                    <Search fontSize="small" />
                </ListItemIcon>
                {t('menu.search')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                </ListItemIcon>
                {t('setting')}
            </MenuItem>
            <MenuItem
                onClick={() => { handleMenuClose(); setEditDialog(true) }}
            >
                <ListItemIcon>
                    <Edit fontSize='small' />
                </ListItemIcon>
                {t('user.edit-profile')}
            </MenuItem>
            <Divider />
            {invitationCode && <>
                <MenuItem onClick={copyInvitationCode} >
                    <ListItemIcon>
                        <CardMembershipOutlined fontSize="small" />
                    </ListItemIcon>
                    {t('profile.invitation-code') + ": " + invitationCode.code}
                    <br />
                    {t('profile.invitation-code-capacity') + ": " + invitationCode.capacity.toString()}
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
                // window.open("https://t.me/poshtibanimoon", '_blank', 'noopener,noreferrer');
                window.location.href = "mailto:contact@aseman.io";
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
            <Divider />
            <MenuItem onClick={() => {
                setLogoutDialog(true);
                handleMenuClose();
            }}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                {t('logout')}
            </MenuItem>
        </Menu>

        <MeikadeDrawer
            open={editDialog}
            onClose={() => setEditDialog(false)}
            anchor='bottom'
            title={t('user.edit-profile')!}
        >
            <EditProfile
                userId={UserGlobal.userId}
                onDone={() => {
                    if (baseRef.current)
                        baseRef.current.reload();
                    UserGlobal.reloadUser();
                    setEditDialog(false)
                }}
            />
        </MeikadeDrawer>
    </Box>
}

export default ProfilePage;