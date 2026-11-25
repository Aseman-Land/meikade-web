import { Delete, Edit, Search } from '@mui/icons-material';
import { alpha, Box, Breadcrumbs, CircularProgress, Container, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AvatarPoemCard from '../../components/avatarpoemcard';
import ContentTitle from '../../components/contenttitle';
import DeleteItem from '../../components/deleteitem';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeDrawer from '../../components/meikadedrawer';
import UserFullname from '../../components/userfullname';
import { MkBook } from '../../models/book';
import { MkContent, MkFullBookResult } from '../../models/content';
import { MkBookServices } from '../../services/book';
import * as UserGlobal from "../../services/user-global";
import { globalBorderRadius, theme } from '../../utils/theme';
import { DefaultSignInDialog } from '../user/signin';
import AddBookDialog from './addbookdialog';

const BookPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();

    const book_id = parseInt(params.book_id!);

    const [editBookDialog, setEditBookDialog] = React.useState<boolean>(false);
    const [deleteMenu, setDeleteMenu] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef(false);
    const [book, setBook] = React.useState<MkFullBookResult>();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const reload = async () => {
        loadingRef.current = true;
        setIsLoading(true);
        try {
            const result = await MkBookServices.getOneBook(book_id);
            if (result.status && result.result)
                setBook(result.result);
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const deleteBook = async (): Promise<boolean> => {
        if (!book || !book.author)
            return false;

        const result = await MkBookServices.deleteBook(book.id);
        if (result.status && result.result) {
            navigate('/profile');
            return true;
        } else {
            return false;
        }
    }

    React.useEffect(() => {
        reload()
    }, [book_id]);

    return <Container maxWidth="sm">
        <MeikadeAppBar
            enableBackButton
            enableMenuButton={book && book.author && book.author.id == UserGlobal.userId ? true : false}
            enableSearchButton={book && book.author && book.author.id != UserGlobal.userId ? true : false}
            onMenuClick={handleMenuOpen}
            onSearchButtonClick={() => {
                if (!book)
                    return;

                navigate(`/book/${book.id}/search`)
            }}
        />
        <Box
            sx={{
                marginTop: '100px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '40%' }} id="busy" />}
            {!isLoading && book && <>
                {book.author && <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'start',
                        gap: '20px'
                    }}
                >
                    <AvatarPoemCard avatar={book.author.avatar} size={64} innerSize={70} outerSize={75} />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                        <UserFullname
                            user={book.author}
                            fontSize={'16px'}
                            fontWeight={'600'}
                        />
                    </Box>
                </Box>}
                <Breadcrumbs separator="›" sx={{ mb: 2, mt: 2 }}>
                    {book.author && <Link
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (book.author)
                                navigate('/user/' + book.author.username)
                        }}
                    >
                        <UserFullname user={book.author} />
                    </Link>}

                    {book.parent && <Link
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (book.parent)
                                navigate('/book/' + book.parent.id.toString())
                        }}
                    >
                        {book.parent.title}
                    </Link>}

                    <Typography color="text.primary">
                        {book.title}
                    </Typography>
                </Breadcrumbs>
                {book.books.length > 0 && <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: '800',
                    }}
                >
                    {t('books.books')}
                </Typography>}
                {book.books.map((bookItem: MkBook) => (
                    <Box
                        key={bookItem.id}
                        onClick={() => navigate('/book/' + bookItem.id)}
                        sx={{
                            py: 2,
                            px: 1,
                            cursor: 'pointer',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            flexDirection: 'column',

                            '&:hover': {
                                color: '#000',
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                borderColor: theme.palette.primary.main,
                            },
                        }}
                    >
                        <Typography sx={{
                            fontSize: '15px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        >
                            {bookItem.title}
                        </Typography>
                        <Typography sx={{
                            fontSize: '12px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            opacity: 0.7
                        }}>
                            {bookItem.description}
                        </Typography>
                    </Box>
                ))}
                {book.contents.length > 0 && <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: '800',
                        marginTop: book.books.length > 0 ? '40px' : '0px',
                    }}
                >
                    {t('books.contents')}
                </Typography>}
                {book.contents.map((content: MkContent) => (
                    <Box
                        key={content.id}
                        onClick={() => navigate('/content/' + content.id.toString())}
                        sx={{
                            py: 2,
                            px: 1,
                            cursor: 'pointer',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            flexDirection: 'column',

                            '&:hover': {
                                color: '#000',
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                borderColor: theme.palette.primary.main,
                            },
                        }}
                    >
                        <ContentTitle
                            contentItem={content}
                            user={book.author}
                            fontSize={'15px'}
                            fontWeight={500}
                        />
                        <Typography
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                fontSize: '12px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'hidden',
                                opacity: 0.7,
                                mt: 1
                            }}
                        >
                            {content.description?.split(' ').length > 10
                                ? content.description.split(' ').splice(0, 10).join(' ') + '...'
                                : content.description
                            }
                        </Typography>
                    </Box>
                ))}
            </>}
        </Box>
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
            <MenuItem
                onClick={() => {
                    if (!book)
                        return;

                    navigate(`/book/${book.id}/search`);
                    handleMenuClose()
                }}
            >
                <ListItemIcon>
                    <Search fontSize="small" />
                </ListItemIcon>
                {t('menu.search')}
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={() => {
                    if (!book)
                        return;

                    setEditBookDialog(true);
                    handleMenuClose()
                }}
            >
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                {t('books.edit')}
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={() => {
                    if (!book)
                        return;

                    setDeleteMenu(true);
                    handleMenuClose()
                }}
            >
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                {t('books.delete')}
            </MenuItem>
        </Menu>

        <MeikadeDrawer
            open={deleteMenu}
            title={t('books.delete')!}
            onClose={() => setDeleteMenu(false)}
            anchor="bottom"
        >
            <DeleteItem
                deleteMessage={t('books.delete-message').replaceAll('%1', book?.title ?? '')}
                deleteMethod={deleteBook}
                onDissmiss={() => {
                    setDeleteMenu(false)
                }}
                onSuccessfull={() => {
                    setDeleteMenu(false);
                }}
            />
        </MeikadeDrawer>

        <AddBookDialog
            open={editBookDialog}
            editBook={book}
            onSuccessfull={() => {
                reload();
                setEditBookDialog(false);
            }}
            onCloseReuqest={() => setEditBookDialog(false)}
        />
    </Container>
}

export default BookPage;