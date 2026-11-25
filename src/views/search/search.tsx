import { ChevronLeft } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import { alpha, Box, CircularProgress, Container, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import ListItemCard from '../../components/listitemcard';
import MeikadeAppBar from '../../components/meikadeappbar';
import SimpleContentCard from '../../components/simplecontentcard';
import UserFullname from '../../components/userfullname';
import UserPoemCard from '../../components/userpoemcard';
import { MkBook, MkUserWithBooks } from '../../models/book';
import { MkFullBookResult, MkFullContent, MkFullContentVerses } from '../../models/content';
import { MkListResult } from '../../models/list';
import { MkFullUser, MkUser } from '../../models/user';
import { MkBookServices } from '../../services/book';
import { MkContentServices } from '../../services/content';
import { MkListServices } from '../../services/list';
import { MkUserServices } from '../../services/user';
import { globalBorderRadius, theme } from '../../utils/theme';

type SearchPageCoreProps = {
    book_id?: string,
    user_id?: string,
    content_id?: string,
    enableBackButton?: boolean,
};

const SearchPageCore = (props: SearchPageCoreProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const keywordParam = searchParams.get('keyword');

    const [isInitializing, setIsInitializing] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<MkUserWithBooks | MkUser>();
    const [book, setBook] = React.useState<MkFullBookResult | MkBook | null>();
    const [content, setContent] = React.useState<MkFullContent>();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [intelligenceSearch, setIntelligenceSearch] = React.useState<boolean>(false);
    const [keyword, setKeyword] = React.useState<string>(keywordParam ?? '');
    const [verses, setVerses] = React.useState<Array<MkFullContentVerses>>([]);
    const [users, setUsers] = React.useState<Array<MkFullUser>>([]);
    const [lists, setLists] = React.useState<Array<MkListResult>>([]);
    const [focused, setFocused] = React.useState(false);
    const [isSearched, setIsSearched] = React.useState(false);
    const loadingRef = React.useRef<boolean>(false);
    const innitializingRef = React.useRef<boolean>(false);

    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 50;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const more = () => {
        doSearch(keyword, verses.length);
    }

    const reload = async () => {
        innitializingRef.current = true;
        if (props.user_id) {
            setIsInitializing(true);
            try {
                const parsed = parseInt(props.user_id);
                const result = isNaN(parsed) ? await MkUserServices.getUser(props.user_id) : await MkUserServices.getUser(parsed.toString());
                if (result.status && result.result) {
                    setUser(result.result);
                }
            } catch {
            }
            setIsInitializing(false)
        }
        if (props.book_id) {
            setIsInitializing(true);
            try {
                const parsed = parseInt(props.book_id);
                if (!isNaN(parsed)) {
                    const result = await MkBookServices.getOneBook(parsed);
                    if (result.status && result.result) {
                        setBook(result.result);
                        if (result.result.author)
                            setUser(result.result.author)
                    }
                }
            } catch {
            }
            setIsInitializing(false)
        }
        if (props.content_id) {
            setIsInitializing(true);
            try {
                const parsed = parseInt(props.content_id);
                if (!isNaN(parsed)) {
                    const result = await MkContentServices.getContent(parsed);
                    if (result.status && result.result) {
                        setContent(result.result)
                        setBook(result.result.book);
                        if (result.result.owner)
                            setUser(result.result.owner)
                    }
                }
            } catch {
            }
            setIsInitializing(false)
        }
        innitializingRef.current = false;

        await doSearch(keyword, 0);
    }

    const search = async (keyword: string) => {
        navigate('?keyword=' + keyword)
    }

    const doSearch = async (keyword: string, offset: number) => {
        if (keyword.length == 0) {
            setVerses([]);
            setIsSearched(false);
            return;
        }
        if (loadingRef.current)
            return;

        loadingRef.current = true;

        setIsLoading(true);
        setIsSearched(true);
        try {
            if (offset == 0) {
                setVerses([]);
                setUsers([]);
                setLists([]);
            }

            const result = await MkContentServices.searchContentVerses({
                book_id: book ? book.id : null,
                search: keyword,
                limit: limit,
                offset: offset,
                author_id: user ? user.id : null,
                content_id: content ? content.id : null,
                intelligence_search: intelligenceSearch,
            });

            if (!props.book_id && !props.content_id && !props.user_id) {
                const usersResult = await MkUserServices.search({
                    keyword: keyword,
                    limit: 50,
                    offset: null,
                    sort_by_name: false,
                });

                const listsResult = await MkListServices.all({
                    user_id: null,
                    search: keyword,
                    limit: 50,
                    offset: null,
                });

                setUsers(usersResult.result ?? []);
                setLists(listsResult.result ?? []);
            }

            if (result.status && result.result) {
                setVerses(offset > 0 ? [...verses, ...result.result] : result.result);
                setHasMore(result.result.length == limit);
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

    React.useEffect(() => {
        reload();
    }, [searchParams]);

    React.useEffect(() => {
        setHasMore(false);
        if (keyword.length > 0) {
            setIsSearched(false);
        }
        if (keyword.trim() === "") {
            setIsSearched(false);
        }
    }, [keyword]);

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    return <Container maxWidth="sm">
        <MeikadeAppBar hideToolbar={!props.enableBackButton} enableBackButton={props.enableBackButton}>
            <Box
                sx={{
                    display: 'flex',
                    width: 'calc(100% - 40px)',
                    maxWidth: '550px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    margin: '12px 0px 12px 0px',
                    height: '40px',
                }}
            >
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    height: '44px',
                    borderRadius: globalBorderRadius,
                    backgroundColor: theme.palette.background.paper,
                    border: focused
                        ? '2px solid' + theme.palette.primary.main
                        : '1px solid #c7c7c7',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                    }}
                    >
                        <SearchIcon
                            onClick={() => search(keyword)}
                            style={{
                                cursor: 'pointer',
                                color: focused
                                    ? theme.palette.primary.main
                                    : '#c7c7c7',
                            }}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        width: '90%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxHeight: '40px'
                    }}
                    >
                        <TextField
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            variant="standard"
                            autoFocus={props.user_id || props.book_id || props.content_id ? true : false}
                            slotProps={{
                                input: {
                                    disableUnderline: true,
                                    sx: {
                                        border: 'none',
                                        outline: 'none',
                                        "& .MuiInputBase-input": {
                                            padding: 1,
                                        },
                                    }
                                }
                            }}
                            placeholder={t('search.search')!}
                            fullWidth
                            value={keyword}
                            onChange={(v) => setKeyword(v.target.value)}
                            onKeyDown={(event) => {
                                if (event.key == 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    search(keyword);
                                }
                            }}
                        />
                        {keyword?.length > 0 && <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'end',
                        }}
                        >
                            <span
                                onClick={() => setKeyword('')}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: focused
                                        ? theme.palette.primary.main
                                        : '#c7c7c7',
                                }}
                            >
                                ×
                            </span>
                        </Box>
                        }
                    </Box>
                </Box>
            </Box>
        </MeikadeAppBar>
        <Box
            sx={{
                marginTop: props.enableBackButton ? '140px' : '80px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            {user &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        background: theme.palette.background.paper,
                        padding: '10px 10px',
                        borderRadius: globalBorderRadius,
                        gap: '2px',
                        border: '1px solid ' + alpha(theme.palette.text.primary, 0.1),
                        alignItems: 'center',
                    }}
                >
                    <Typography sx={{ fontWeight: 500, color: theme.palette.primary.main, margin: '0px 10px' }}>{t('search.search_on') + ':'}</Typography>
                    <UserFullname user={user} />
                    {book && <>
                        <ChevronLeft sx={{ fontSize: '14px' }} />
                        <Typography>{book.title}</Typography>
                    </>}
                    {content && <>
                        <ChevronLeft sx={{ fontSize: '14px' }} />
                        <Typography>{content.title}</Typography>
                    </>}
                </Box>
            }
            {!isInitializing && <>
                {users.length > 0 && <>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: '800',
                            marginTop: '10px',
                        }}
                    >
                        {t('search.users')}
                    </Typography>
                    <Box sx={{
                        marginLeft: '-16px',
                        marginRight: '-16px',
                    }}>
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={4.3}
                            breakpoints={{
                                480: { slidesPerView: 4.5 },
                                600: { slidesPerView: 4.8 },
                                768: { slidesPerView: 5.5 },
                                900: { slidesPerView: 5.4 },
                            }}
                        >
                            {users.map((user: MkFullUser) => (
                                <SwiperSlide key={user.id}>
                                    <UserPoemCard user={user} />
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <Box sx={{ width: '50px', height: '10px' }} />
                            </SwiperSlide>
                        </Swiper>
                    </Box>
                </>}
                {lists.length > 0 && <>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: '800',
                            marginTop: '10px',
                        }}
                    >
                        {t('search.lists')}
                    </Typography>
                    <Box sx={{
                        marginLeft: '-16px',
                        marginRight: '-16px',
                    }}>
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={2.2}
                            breakpoints={{
                                480: { slidesPerView: 2.8 },
                                600: { slidesPerView: 3.2 },
                                768: { slidesPerView: 3.2 },
                                900: { slidesPerView: 3.2 }
                            }}
                        >
                            {lists.map((list: MkListResult) => (
                                <SwiperSlide>
                                    <ListItemCard list={list} sx={{ marginLeft: '16px' }} disableUser />
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <Box sx={{ width: '50px', height: '10px' }} />
                            </SwiperSlide>
                        </Swiper>
                    </Box>
                </>}
                {verses.length > 0 && <>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: '800',
                            marginTop: '10px',
                        }}
                    >
                        {t('search.contents')}
                    </Typography>
                    {verses?.map((verse: MkFullContentVerses) => (
                        <>
                            {verse.content && <SimpleContentCard contentItem={verse.content} highlight={intelligenceSearch ? undefined : verse} onReloadRequest={reload} />}
                        </>
                    ))}
                </>}
            </>}
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2, marginBottom: '100px' }}>
                {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: verses.length == 0 ? '150px 0px' : '20px 10px' }} id="busy" />}
            </Box>
            {!isLoading && verses.length == 0 && users.length == 0 && lists.length == 0 && <>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 'calc(40vh - 100px)',
                    position: 'fixed',
                    gap: '10px'
                }}
                >
                    {isSearched && keyword.length > 0 ? <>
                        <SearchOffOutlinedIcon sx={{
                            fontSize: '60px',
                            color: '#9a9a9a',
                            mb: '2',
                            opacity: 0.4,
                        }}
                        />
                        <Typography sx={{
                            textAlign: 'center',
                            color: '#808080',
                            fontSize: '16px',
                            fontWeight: '500',
                            opacity: 0.4,
                        }}
                        >
                            {t('search.not_found')}
                        </Typography>
                    </> : <>
                        <SearchIcon sx={{
                            fontSize: '60px',
                            color: '#9a9a9a',
                            mb: '2',
                            opacity: 0.4,
                        }}
                        />
                        <Typography sx={{
                            textAlign: 'center',
                            color: '#808080',
                            fontSize: '16px',
                            fontWeight: '500',
                            opacity: 0.4,
                        }}
                        >
                            {t('search.description')}
                        </Typography>
                    </>}
                </Box>
            </>}
        </Box>
    </Container>
}

export const SearchOnUserPage = () => {
    const params = useParams();
    return <SearchPageCore enableBackButton user_id={params.user_id!} />
}

export const SearchOnBookPage = () => {
    const params = useParams();
    return <SearchPageCore enableBackButton book_id={params.book_id!} />
}

export const SearchOnContentPage = () => {
    const params = useParams();
    return <SearchPageCore enableBackButton content_id={params.content_id!} />
}

const SearchPage = () => {
    return <SearchPageCore />
}

export default SearchPage;