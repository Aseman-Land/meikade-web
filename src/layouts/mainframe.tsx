import { BookmarksOutlined, ContentCopy, DeleteOutlined, EditOutlined, NoteAdd, Share } from '@mui/icons-material';
import { Alert, Box, Divider, ListItemIcon, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import Slide, { SlideProps } from '@mui/material/Slide';
import { BoxProps } from '@mui/system';
import * as React from 'react';
import { Cookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { AchievementItem } from '../components/achievementitemcard';
import MeikadeDialog from '../components/meikadedialog';
import MeikadeDrawer from '../components/meikadedrawer';
import { SimplePoemContent, SimplePoemHighlight } from '../components/simplepoemcard';
import * as UserGlobal from "../services/user-global";
import { globalBorderRadius } from '../utils/theme';
import AchievementFullItem from '../views/achievement/achievementfullitem';
import AddContent, { QuoteContentVerse } from '../views/content/addcontent';
import DeleteContent from '../views/content/deletecontent';
import ContentLists from '../views/lists/contentlists';
import ContentNoteEdit from '../views/notes/contentnoteedit';
import PasswordChanger from '../views/settings/passwordchange';
import SetupDialog from '../views/setup/setupdialog';
import AgreementDialog from '../views/user/agreementdialog';
import ShareItem from '../views/user/shareitem';
import { DefaultSignInDialog } from '../views/user/signin';
import AddPWAPage from '../components/addpwadialog';

let itemHandleError_method: (text: string | null) => void = () => { };

export const globalHandleError = (text: string | null) => {
    itemHandleError_method(text);
};

let itemShowInfoMessage_method: (text: string | null) => void = () => { };

export const globalShowInfoMessage = (text: string | null) => {
    itemShowInfoMessage_method(text);
};

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

let itemSignIn_method: (state: boolean) => void = () => { };

export const showSignInDialog = () => {
    itemSignIn_method(true);
}

let showContentMenu_method: (content: SimplePoemContent, highlight: SimplePoemHighlight, e: React.MouseEvent<HTMLElement>, reloadRequest: (() => void) | null) => void = () => { };

export const showContentMenu = (content: SimplePoemContent, highlight: SimplePoemHighlight, e: React.MouseEvent<HTMLElement>, reloadRequest: (() => void) | null) => {
    showContentMenu_method(content, highlight, e, reloadRequest);
}

let showAddMenu_method: (content: SimplePoemContent | null, callback: (() => void) | null) => void = () => { };

export const showAddMenu = (content: SimplePoemContent | null, callback: (() => void) | null) => {
    showAddMenu_method(content, callback);
}

let showQuoteMenu_method: (content: QuoteContentVerse | null, callback: (() => void) | null) => void = () => { };

export const showQuoteMenu = (content: QuoteContentVerse | null, callback: (() => void) | null) => {
    showQuoteMenu_method(content, callback);
}

let showAchievement_method: (ach: AchievementItem | null) => void = () => { };

export const showAchievement = (ach: AchievementItem | null) => {
    showAchievement_method(ach);
}


let quoteMenuCallback: null | (() => void) = () => { };
let addMenuCallback: null | (() => void) = () => { };
let reloadRequestCallback: null | (() => void) = () => { };

type MainFrameProps = {

} & BoxProps;

const MainFrame = (props: MainFrameProps) => {
    const { t } = useTranslation();
    const cookies = new Cookies();

    const [error, setError] = React.useState<string | null>(null);
    const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
    const [signInOpen, setSignInOpen] = React.useState<boolean>(false);
    const [agreementDialog, setAgreementDialog] = React.useState<boolean>(false);

    const [shareContent, setShareContent] = React.useState<SimplePoemContent | null>(null);

    const [selectedAchievement, setSelectedAchievement] = React.useState<AchievementItem | null>(null);
    const [setupDialog, setSetupDialog] = React.useState<number | null>(null);
    const [passwordDialog, setPasswordDialog] = React.useState<boolean>(false);

    const [contentEditMenu, setContentEditMenu] = React.useState<boolean>(false);
    const [contentEdit, setContentEdit] = React.useState<SimplePoemContent | null>(null);
    const [contentHighlightEdit, setContentHighlightEdit] = React.useState<SimplePoemHighlight | null>(null);
    const [contentEditAnchorEl, setContentEditAnchorEl] = React.useState<null | HTMLElement>(null);

    const [addMenu, setAddMenu] = React.useState<boolean>(false);
    const [deleteMenu, setDeleteMenu] = React.useState<boolean>(false);
    const [addMenuEdit, setAddMenuEdit] = React.useState<SimplePoemContent | null>(null);
    const [quoteContent, setQuoteContent] = React.useState<QuoteContentVerse | null>(null);

    const [isCopied, setIsCopied] = React.useState<boolean>(false);
    const [addListChanged, setAddListChanged] = React.useState<boolean>(false);
    const [addListDialog, setAddListDialog] = React.useState<boolean>(false);
    const [editNoteDialog, setEditNoteDialog] = React.useState<boolean>(false);

    React.useEffect(() => {
        itemSignIn_method = (stt) => setSignInOpen(stt);
        itemHandleError_method = handleError;
        itemShowInfoMessage_method = (text) => setInfoMessage(text);
        showAchievement_method = (ach) => setSelectedAchievement(ach);
        showAddMenu_method = (content, callback) => {
            setAddMenuEdit(content);
            setQuoteContent(null);
            addMenuCallback = callback;
            setAddMenu(true);
        }
        showQuoteMenu_method = (content, callback) => {
            setAddMenuEdit(null);
            setQuoteContent(content);
            quoteMenuCallback = callback;
            setAddMenu(true);
        }
        showContentMenu_method = (content, highlight, e, reloadRequest) => {
            reloadRequestCallback = reloadRequest;
            setContentHighlightEdit(highlight);
            setContentEdit(content);
            setContentEditAnchorEl(e.currentTarget);
            setContentEditMenu(true);
        };
    }, []);

    React.useEffect(() => {
        if (addListChanged && !addListDialog) {
            reloadRequestCallback!();
        }
    }, [addListDialog])

    React.useEffect(() => {
        if (!addMenu) {
            setContentHighlightEdit(null);
        }
    }, [addMenu])

    React.useEffect(() => {
        if (UserGlobal.hasPasswordChangeAuth) {
            setPasswordDialog(true);
        } else {
            const u = UserGlobal.user;
            if (u) {
                if (!u.agreement || u.agreement < u.latest_agreement)
                    setAgreementDialog(true);
                else if (!u.setup_version || u.setup_version < 1)
                    setSetupDialog(u.setup_version ?? 0);
            }
        }
    }, [])

    const handleError = (text: string | null) => {
        switch (text) {
            case "invalid_agreement":
                setAgreementDialog(true);
                return;
            case "relation_view_failed":
            case "relation view failed":
                return;

            case "limit_reached":
            case "limit reached":
                text = t('errors.limit-reached')
                break;
        }

        if (text && text.length > 0)
            text = text[0].toUpperCase() + text.slice(1).replaceAll("_", " ");

        setError(text);
    }

    const handleCopy = async (text: string) => {
        if (!contentEdit)
            return;

        try {
            await navigator.clipboard.writeText(text);
            globalShowInfoMessage(t('messages.info.copied'));
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleShare = (text: string, link: string) => {
        if (!contentEdit)
            return;

        const textToCopy: string = contentEdit.title + '\n' + (contentEdit.owner ? contentEdit.owner.firstname + ' ' + (contentEdit.owner.lastname ?? '') : '').trim() + (contentEdit.book ? '\n' + contentEdit.book.title : '') + '\n\n' + text;

        navigator.share({
            title: t('app.title') ?? 'Meikade',
            text: textToCopy,
            url: link,
        });
    }

    const getText = (): string => {
        var text: string = '';
        if (!contentEdit || !contentEdit.poem)
            return text;

        contentEdit.poem.verses.forEach(v => {
            if (text.length > 0)
                text += '\n';
            text += v.text
        });

        return text;
    }

    var pwa_dialog: boolean = false;
    try {
        pwa_dialog = (localStorage.getItem('pwa_dialog') == 'true');
    } catch (e) { }

    var workerScript: boolean = false;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && !pwa_dialog) {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.getRegistration('/').then((registration) => {
                if (registration) {
                    console.log('PWA Mode: Yes (Service Worker Registered)');
                } else {
                    setPWAVisible(true);
                }
            });
        } else {
            workerScript = true;
        }
    }

    const [pwaVisible, setPWAVisible] = React.useState<boolean>(workerScript);

    if (pwaVisible) {
        return <AddPWAPage
            onDone={() => {
                try {
                    localStorage.setItem('pwa_dialog', 'true');
                } catch { }
                setPWAVisible(false);
            }}
        />;
    } else {
        try {
            localStorage.setItem('pwa_dialog', 'true');
        } catch { }
    }

    return <Box {...props}>
        <Outlet />
        <DefaultSignInDialog open={signInOpen} onClose={() => setSignInOpen(false)} />

        <Menu
            anchorEl={contentEditAnchorEl}
            open={contentEditMenu}
            onClose={() => setContentEditMenu(false)}
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
            {contentEdit && contentEdit.owner_id == UserGlobal.userId && (!contentEdit.activity || (contentEdit.poem && contentEdit.poem.verses.length > 0)) && <>
                <MenuItem
                    onClick={() => {
                        showAddMenu(contentEdit, reloadRequestCallback);
                        setContentEditMenu(false);
                    }}
                >
                    <ListItemIcon>
                        <EditOutlined fontSize="small" />
                    </ListItemIcon>
                    <Typography>{t('mainframe.content-menu.edit')}</Typography>
                </MenuItem>
                <Divider />
            </>}
            {UserGlobal.userId != 0 && contentEdit && (!contentEdit.activity || !contentEdit.activity.target_user_achievement) && <>
                <MenuItem
                    onClick={() => {
                        setAddListChanged(false);
                        setAddListDialog(true);
                        setContentEditMenu(false);
                    }}
                >
                    <ListItemIcon>
                        <BookmarksOutlined fontSize="small" />
                    </ListItemIcon>
                    <Typography>{t('mainframe.content-menu.list-add')}</Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setEditNoteDialog(true);
                        setContentEditMenu(false);
                    }}
                >
                    <ListItemIcon>
                        <NoteAdd fontSize="small" />
                    </ListItemIcon>
                    <Typography>{t('mainframe.content-menu.note-add')}</Typography>
                </MenuItem>
                <Divider />
            </>}
            {contentEdit && (!contentEdit.activity || !contentEdit.activity.target_user_achievement) &&
                <MenuItem
                    onClick={() => {
                        handleCopy(getText());
                        setContentEditMenu(false);
                    }}
                >
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <Typography>{t('mainframe.content-menu.copy-verse')}</Typography>
                </MenuItem>
            }
            <MenuItem
                onClick={() => {
                    if (contentEdit && contentEdit.poem) {
                        setShareContent(contentEdit);
                    } else {
                        const link: string = contentEdit ? window.location.origin + '/content/' + contentEdit.id.toString() : window.location.href;
                        handleShare(getText(), link);
                    }
                    setContentEditMenu(false);
                }}
            >
                <ListItemIcon>
                    <Share fontSize="small" />
                </ListItemIcon>
                <Typography>{t('mainframe.content-menu.share')}</Typography>
            </MenuItem>
            {contentEdit && contentEdit.owner_id == UserGlobal.userId && <>
                <Divider />
                <MenuItem
                    onClick={() => {
                        setDeleteMenu(true);
                        setContentEditMenu(false);
                    }}
                >
                    <ListItemIcon>
                        <DeleteOutlined fontSize="small" />
                    </ListItemIcon>
                    <Typography>{t('mainframe.content-menu.delete')}</Typography>
                </MenuItem>
            </>}
        </Menu>

        <MeikadeDrawer
            open={shareContent != null}
            onClose={() => setShareContent(null)}
            anchor="bottom"
        >
            <ShareItem contentItem={shareContent ?? undefined} />
        </MeikadeDrawer>

        <MeikadeDrawer
            open={selectedAchievement != null}
            onClose={() => setSelectedAchievement(null)}
            anchor="bottom"
        >
            <AchievementFullItem achievement={selectedAchievement ?? undefined} />
        </MeikadeDrawer>

        <MeikadeDrawer
            open={addMenu}
            title={(addMenuEdit ? t('add-content.title-edit') : quoteContent ? t('add-content.title-quote') : t('add-content.title'))!}
            onClose={() => setAddMenu(false)}
            anchor="bottom"
        >
            <AddContent
                editContent={addMenuEdit ?? undefined}
                quoteContent={quoteContent ?? undefined}
                quoteContentHighlight={contentHighlightEdit ?? undefined}
                onDissmiss={() => {
                    setAddMenu(false)
                }}
                onSuccessfull={() => {
                    setAddMenu(false);
                    if (addMenuCallback)
                        addMenuCallback!()
                    else if (quoteContent)
                        quoteMenuCallback!()
                }}
            />
        </MeikadeDrawer>

        <MeikadeDrawer
            open={deleteMenu}
            title={t('mainframe.content-menu.delete')!}
            onClose={() => setDeleteMenu(false)}
            anchor="bottom"
        >
            <DeleteContent
                contentItem={contentEdit ?? undefined}
                onDissmiss={() => {
                    setDeleteMenu(false)
                }}
                onSuccessfull={() => {
                    setDeleteMenu(false);
                    reloadRequestCallback!()
                }}
            />
        </MeikadeDrawer>

        {contentEdit && <MeikadeDialog
            open={addListDialog}
            fullWidth
            title={t('content-page.add-list')!}
            onClose={() => {
                setAddListDialog(false)
            }}
        >
            <ContentLists
                contentId={contentEdit.id}
                onSubmited={() => {
                    setAddListChanged(true);
                }}
            />
        </MeikadeDialog>}
        {contentEdit && <MeikadeDrawer
            open={editNoteDialog}
            anchor="bottom"
            title={t('content-page.edit-note')!}
            onClose={() => setEditNoteDialog(false)}
        >
            <ContentNoteEdit
                contentId={contentEdit.id}
                onSubmited={() => {
                    setEditNoteDialog(false);
                }}
            />
        </MeikadeDrawer>}

        {passwordDialog && <MeikadeDrawer
            open={passwordDialog}
            onClose={() => setPasswordDialog(false)}
            nonClosable
            anchor='bottom'
            title={t('settings.password.title')!}
        >
            <PasswordChanger
                disableCurrent
                onPasswordChanged={() => {
                    cookies.remove('token', { path: '/' });
                    window.location.href = '/';
                    setPasswordDialog(false);
                }}
            />
        </MeikadeDrawer>}

        <AgreementDialog
            open={agreementDialog}
            onClose={() => setAgreementDialog(false)}
        />

        <SetupDialog
            open={setupDialog != null ? true : false}
            onClose={() => setSetupDialog(null)}
            currentVersion={setupDialog ?? 0}
        />

        {error && <Snackbar
            open={error ? true : false}
            onClose={() => setError(null)}
            slots={{ transition: SlideTransition }}
            autoHideDuration={3000}
        >
            <Alert
                onClose={() => setError(null)}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                <Typography sx={{ color: '#fff' }}>
                    {error}
                </Typography>
            </Alert>
        </Snackbar>}

        <Snackbar
            open={infoMessage ? true : false}
            onClose={() => setInfoMessage(null)}
            slots={{ transition: SlideTransition }}
            autoHideDuration={3000}
        >
            <Alert
                onClose={() => setInfoMessage(null)}
                severity="info"
                variant="filled"
                sx={{ width: '100%' }}
            >
                <Typography sx={{ color: '#fff' }}>
                    {infoMessage}
                </Typography>
            </Alert>
        </Snackbar>
    </Box>
}

export default MainFrame
