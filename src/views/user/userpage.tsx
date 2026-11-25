import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Add, Lock, MilitaryTech } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { alpha, Box, Button, ButtonBase, CircularProgress, Container, Tab, Tabs, Typography } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import AchievementItemCard, { AchievementItem } from '../../components/achievementitemcard';
import AvatarPoemCard from '../../components/avatarpoemcard';
import FollowButton from '../../components/followbutton';
import ListItemCard from '../../components/listitemcard';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeDialog from '../../components/meikadedialog';
import MeikadeDrawer from '../../components/meikadedrawer';
import SimpleContentCard from '../../components/simplecontentcard';
import UserFullname from '../../components/userfullname';
import { showAchievement } from '../../layouts/mainframe';
import { MkAchievement, MkUserAchievement } from '../../models/achievement';
import { MkBook, MkUserWithBooks } from '../../models/book';
import { MkFullContent } from '../../models/content';
import { MkListResult } from '../../models/list';
import { MkAchievementServices } from '../../services/achievement';
import { MkContentServices } from '../../services/content';
import { MkListServices } from '../../services/list';
import { MkUserServices } from '../../services/user';
import * as UserGlobal from "../../services/user-global";
import { globalBorderRadiusValue, theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';
import AddBookDialog from '../book/addbookdialog';
import AddListDialog from '../lists/addlistdialog';
import MyAchievementsDialog from '../profile/myachievementsdialog';
import FollowList from './followlist';
import { DefaultSignInDialog } from './signin';

export type UserPageCustomListrops = {
    title: string,
    count: number,
    onClick?: () => void,
}

const UserPageCustomList = (props: UserPageCustomListrops) => {
    const { t } = useTranslation();

    return <ButtonBase
        sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            textAlign: 'start',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '18px',
            height: '80px',
            padding: '0px 20px',
            width: '100%',
            maxWidth: '100%',
            marginLeft: '16px',
            alignItems: 'start',
        }}
        onClick={props.onClick}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',
            }}
        >
            <Typography
                sx={{
                    fontSize: { xs: '12px', sm: '13px' },
                    fontWeight: 600,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {props.title}
            </Typography>
            <Lock sx={{ fontSize: '14px', opacity: 0.8 }} />
        </Box>
        {props.count != null && <Typography sx={{
            display: 'flex',
            fontSize: '12px',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
            {t('list-card.count').replaceAll("%1", (props.count >= 1_000_000
                ? `${(props.count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
                : props.count >= 1_000
                    ? `${(props.count / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                    : props.count).toString())}
        </Typography>}
    </ButtonBase>;
}

export type UserStateItemProps = {
    title: string,
    value: number,
    firstItem?: boolean,
    lastItem?: boolean,
    onClick?: () => void,
}

const UserStateItem = (props: UserStateItemProps) => {

    const valueToString = (value: number): string => {
        return (value >= 1_000_000
            ? `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
            : (value >= 1_000
                ? `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                : value.toString()));
    }

    return <Button
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: `${globalBorderRadiusValue / 2}px`,
            padding: '30px 10px',
            width: '100%',
            background: theme.palette.background.paper,
            color: 'unset',
            marginLeft: '16px',
        }}
        onClick={props.onClick}
    >
        <Typography sx={{ fontSize: '12px' }}>{props.title}</Typography>
        <Typography sx={{
            fontSize: '16px',
            fontWeight: '700'
        }}>
            {valueToString(props.value)}
        </Typography>
    </Button>
}

export interface UserPageBaseRef {
    reload: () => void;
}

export type UserPageBaseProps = {
    user_id: string,
    profilePage?: boolean,
    loading?: boolean,
    onMenuRequest?: (event: React.MouseEvent<HTMLElement>) => void,
}

type SectionItemData = {
    title: string,
    value: number,
    onClick?: () => void,
}

export const UserPageBase = React.forwardRef<UserPageBaseRef, UserPageBaseProps>((props, userRef) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [globalAchievement, setGlobalAchievement] = React.useState<boolean>(false);
    const [addBookDialog, setAddBookDialog] = React.useState<boolean>(false);
    const [addListDialog, setAddListDialog] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLoadingContents, setIsLoadingContents] = React.useState<boolean>(false);
    const [editable, setEditable] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<MkUserWithBooks>();
    const [contents, setContents] = React.useState<MkFullContent[]>([]);
    const [lists, setLists] = React.useState<MkListResult[]>([]);
    const [achievements, setAchievements] = React.useState<AchievementItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [isClamped, setIsClamped] = React.useState(false);
    const textRef = React.useRef<HTMLDivElement>(null);
    const [currentTab, setCurrentTab] = React.useState<number>(0);
    const [followingsDialog, setFollowingsDialog] = React.useState<MkUserWithBooks | undefined>(undefined);
    const [followersDialog, setFollowersDialog] = React.useState<MkUserWithBooks | undefined>(undefined);
    const loadingRef = React.useRef<boolean>(false);
    const loadingContentRef = React.useRef<boolean>(false);
    const [hasMore, setHasMore] = React.useState<boolean>(false);
    const [sectionItems, setSectionItems] = React.useState<Array<SectionItemData>>([]);

    const limit: number = 20;

    React.useImperativeHandle(userRef, () => ({
        reload() {
            reloadData(true);
        }
    }));

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const more = () => {
        reloadContents(contents.length);
    }

    const reloadData = async (loading: boolean) => {
        if (loadingRef.current) return;
        if (props.user_id == '0')
            return;

        loadingRef.current = true;
        setIsLoading(loading);
        try {
            const parsed = parseInt(props.user_id);
            const result = isNaN(parsed) ? await MkUserServices.getUser(props.user_id) : await MkUserServices.getUser(parsed.toString());
            if (result.status && result.result) {
                const user = result.result;
                const isMe: boolean = user.id == UserGlobal.userId;

                setUser(user);
                setEditable(isMe);
                if (user.verified_level == 3)
                    setCurrentTab(1);

                const activities = await MkUserServices.getUserActivities(user.id);

                const lists = await MkListServices.all({
                    user_id: user.id,
                    offset: 0,
                    limit: 20,
                    search: null,
                });
                if (lists.status && lists.result)
                    setLists(lists.result);
                else
                    setLists([]);

                const achievements = await MkAchievementServices.getUserAchievements(user.id);
                const globalAchievements = await MkAchievementServices.getAchievements();

                const achievementMap: Map<number, AchievementItem> = new Map<number, AchievementItem>();
                const achievementList: Array<AchievementItem> = [];
                const achievementInserted: Array<number> = [];

                if (achievements.status && achievements.result) {
                    achievements.result.forEach((ach: MkUserAchievement) => {
                        const item = achievementMap.get(ach.achievement_id);
                        if (item) {
                            item.count++;
                            item.created_at = ach.created_at;
                        } else if (ach.achievement) {
                            achievementMap.set(ach.achievement_id, {
                                achievement: ach.achievement,
                                created_at: ach.created_at,
                                count: 1,
                            });
                        }
                    });

                    achievements.result.forEach((ach: MkUserAchievement) => {
                        const item = achievementMap.get(ach.achievement_id);
                        if (item) {
                            achievementList.push(item);
                            achievementInserted.push(ach.achievement_id);
                        }
                    });
                }

                if (globalAchievements.result && isMe) {
                    globalAchievements.result.forEach((ach: MkAchievement) => {
                        const item = achievementMap.get(ach.id);
                        if (!item) {
                            achievementMap.set(ach.id, {
                                achievement: ach,
                                created_at: undefined,
                                count: 0,
                            });
                        }
                    });

                    globalAchievements.result.forEach((ach: MkAchievement) => {
                        const item = achievementMap.get(ach.id);
                        if (item && achievementInserted.indexOf(ach.id) < 0)
                            achievementList.push(item);
                    });
                }

                setAchievements(achievementList);

                const sections = new Array<SectionItemData>();
                if (user.total_contents && user.total_contents > 0) sections.push({ title: t("content"), value: user.total_contents });
                if (user.total_rates && user.total_rates > 0) sections.push({ title: t("rate"), value: user.total_rates });
                if (user.total_views && user.total_views > 0) sections.push({ title: t("view"), value: user.total_views });
                if (achievements.result && achievements.result.length > 0) sections.push({ title: t("achievements.title"), value: achievements.result.length });
                if (activities.result) {
                    const full_activities = activities.result;
                    if (full_activities.read) {
                        const read = full_activities.read;
                        if (read.contents && read.contents > 0) sections.push({ title: t("activities.read.content"), value: read.contents });
                        if (read.seconds && read.seconds > 60) sections.push({ title: t("activities.read.minutes"), value: Math.floor(read.seconds / 60) });
                        if (read.verses && read.verses > 0) sections.push({ title: t("activities.read.verses"), value: read.verses });
                    }
                }
                if (user.followings > 0) sections.push({ title: t("followings"), value: user.followings, onClick: () => setFollowingsDialog(user) });
                if (user.followers > 0) sections.push({ title: t("followers"), value: user.followers, onClick: () => setFollowersDialog(user) });
                setSectionItems(sections);
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

    const reloadContents = async (offset: number) => {
        if (!user)
            return;

        if (loadingContentRef.current) return;

        loadingContentRef.current = true;
        setIsLoadingContents(true);
        try {
            if (offset == 0)
                setContents([]);

            const result = await MkContentServices.searchContents({
                intelligence_search: false,
                author_id: user.id,
                offset: offset,
                limit: limit,
                book_id: null,
                search: null,
                sort_by_rate: currentTab == 0 ? false : true,
            });

            await sleep(1000);
            if (result.status && result.result) {
                setContents(offset > 0 ? [...contents, ...result.result] : result.result);
                setHasMore(result.result.length == limit);
            }
        } catch {
        }
        setIsLoadingContents(false);
        loadingContentRef.current = false;
    };

    React.useEffect(() => {
        reloadContents(0)
    }, [user, currentTab]);

    React.useEffect(() => {
        reloadData(true);
        setFollowersDialog(undefined);
        setFollowingsDialog(undefined);
    }, [props.user_id]);

    React.useEffect(() => {
        if (props.loading != undefined)
            setIsLoading(props.loading);
    }, [props.loading]);

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    React.useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        const maxHeight = lineHeight * 5;

        if (el.scrollHeight > maxHeight) {
            setIsClamped(true);
        }
    }, [isLoading, user?.about]);

    return <Container maxWidth="sm">
        <MeikadeAppBar
            enableSearchButton={!props.profilePage}
            enableMenuButton={props.profilePage}
            enableBackButton={!props.profilePage}
            onSearchButtonClick={() => {
                if (!user)
                    return;

                navigate(`/user/${user.username}/search`)
            }}
            onMenuClick={props.onMenuRequest}
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
            {!isLoading && user && <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'start',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'start',
                                alignItems: 'center',
                                gap: '15px',
                            }}
                        >
                            <AvatarPoemCard avatar={user.avatar} size={64} innerSize={70} outerSize={76} />

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'start',
                                    gap: '2px',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <UserFullname
                                        user={user}
                                        fontSize={'18px'}
                                        fontWeight={'800'}
                                    />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        opacity: 0.7,
                                        direction: 'rtl',
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        wordBreak: 'break-all',
                                    }}
                                >
                                    {'@' + user.username}
                                </Typography>
                            </Box>
                        </Box>

                        {!editable && UserGlobal.user && <FollowButton followed={user.followed ?? false} followed_you={user.followed_you ?? false} user_id={user.id} />}
                    </Box>
                </Box>
                <Box
                    sx={{
                        margin: '10px 0px',
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            marginLeft: '-16px',
                            marginRight: '-16px',
                        }}
                    >
                        <Swiper
                            spaceBetween={5}
                            slidesPerView={2.2}
                            breakpoints={{
                                320: { slidesPerView: 3.2 },
                                400: { slidesPerView: 4.2 },
                                480: { slidesPerView: 4.8 },
                            }}
                        >
                            {sectionItems.map((s: SectionItemData, index: number) => (
                                <SwiperSlide>
                                    <UserStateItem
                                        title={s.title}
                                        value={s.value}
                                        firstItem={index == 0}
                                        lastItem={index == sectionItems.length - 1}
                                        onClick={s.onClick}
                                    />
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <Box sx={{ width: '50px', height: '10px' }} />
                            </SwiperSlide>
                        </Swiper>
                    </Box>
                </Box>
                <Typography ref={textRef}
                    sx={{
                        textAlign: 'justify',
                        lineHeight: 1.9,
                        fontSize: "15px",
                        whiteSpace: "pre-line",
                        ...(isClamped && {
                            display: "-webkit-box",
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }),
                    }}
                >
                    {user.about}
                </Typography>
                {isClamped && (
                    <Typography
                        component="span"
                        onClick={() => setOpen(true)}
                        sx={{
                            color: "primary.main",
                            cursor: "pointer",
                            textDecoration: "underline",
                            fontSize: "14px",
                        }}
                    >
                        {t('more')}
                    </Typography>
                )}
                <MeikadeDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="md"
                    fullWidth
                    titleObjects={<UserFullname user={user} />}
                >
                    <Typography
                        sx={{
                            textAlign: "justify",
                            lineHeight: 2.5,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {user.about}
                    </Typography>
                </MeikadeDialog>
                {(achievements.length > 0 || editable) && <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography sx={{
                            fontSize: '16px',
                            fontWeight: '800',
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}
                        >
                            {t('achievement.section')}
                        </Typography>
                        {editable && <Button
                            sx={{
                                fontSize: '12px',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '4px',
                            }}
                            onClick={() => setGlobalAchievement(true)}
                        >
                            <MilitaryTech />
                            {t('achievement.more')}
                        </Button>}
                    </Box>
                    <Box
                        sx={{
                            marginLeft: '-16px',
                            marginRight: '-16px',
                        }}
                    >
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
                            {achievements.map((ach: AchievementItem) => (
                                <SwiperSlide>
                                    <AchievementItemCard
                                        achievement={ach}
                                        sx={{ marginLeft: '16px' }}
                                        onClick={() => {
                                            if (ach.count > 0)
                                                showAchievement(ach)
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <Box sx={{ width: '50px', height: '10px' }} />
                            </SwiperSlide>
                        </Swiper>
                    </Box>
                </>}
                {(user.books.length > 0 || editable) && <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography sx={{
                            fontSize: '16px',
                            fontWeight: '800',
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}
                        >
                            {t('user.books')}
                        </Typography>
                        {editable && <Button
                            sx={{
                                fontSize: '12px',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '4px',
                            }}
                            onClick={() => setAddBookDialog(true)}
                        >
                            <Add />
                            {t('user.add-book')}
                        </Button>}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            mb: 4
                        }}
                    >
                        {user.books.map((book: MkBook, index: number) => (

                            <ButtonBase
                                key={book.id}
                                component={RouterLink}
                                to={`/book/${book.id}`}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    textAlign: 'right',
                                    px: 2,
                                    py: 2,
                                    borderBottom: index !== user.books.length - 1
                                        ? '1px solid'
                                        : 'none',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s ease',

                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        borderColor: theme.palette.primary.main
                                    },
                                    '&:hover .chevron': {
                                        color: theme.palette.primary.main
                                    }
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
                                    {book.title}
                                </Typography>
                                <ChevronLeftIcon className='chevron'
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 20,
                                    }}
                                />

                            </ButtonBase>
                        ))}
                    </Box>
                </>}
                {(lists.length > 0 || editable) && <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: '800',
                                marginTop: '10px',
                                marginBottom: '10px'
                            }}
                        >
                            {t('user.lists')}
                        </Typography>
                        {editable && <Button
                            sx={{
                                fontSize: '12px',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '4px',
                            }}
                            onClick={() => setAddListDialog(true)}
                        >
                            <Add />
                            {t('user.add-list')}
                        </Button>}
                    </Box>
                    <Box
                        sx={{
                            marginLeft: '-16px',
                            marginRight: '-16px',
                        }}
                    >
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
                            {editable && <>
                                <SwiperSlide>
                                    <UserPageCustomList
                                        title={t("user.favorite")}
                                        count={user.favorites_count ?? 0}
                                        onClick={() => navigate('/favorites')}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <UserPageCustomList
                                        title={t("user.note")}
                                        count={user.notes_count ?? 0}
                                        onClick={() => navigate('/notes')}
                                    />
                                </SwiperSlide>
                            </>}
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

                {user.total_contents != null && user.total_contents > 0 && <>
                    <Typography sx={{
                        fontSize: '16px',
                        fontWeight: '800',
                        marginTop: '10px',
                    }}
                    >
                        {user && user.verified_level != 3 ? t('user.contents') : t('user.top-contents')}
                    </Typography>

                    {user && user.verified_level != 3 && <Tabs
                        variant='fullWidth'
                        value={currentTab}
                        onChange={(event: React.SyntheticEvent, newValue: number) => {
                            setCurrentTab(newValue);
                        }}
                        centered
                        sx={{
                            width: '100%',
                            maxWidth: 'sm',
                            marginTop: '-10px',
                        }}
                    >
                        <Tab value={0} label={t('user.latest-contents')} />
                        <Tab value={1} label={t('user.top-contents')} />
                    </Tabs>}

                    {contents.map((c: MkFullContent) => (
                        <SimpleContentCard contentItem={c} onReloadRequest={() => {
                            reloadContents(0);
                        }} />
                    ))}
                    <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        {isLoadingContents && <CircularProgress sx={{ alignSelf: 'center', margin: contents.length == 0 ? '50px 0px' : '20px 10px' }} id="busy" />}
                    </Box>
                </>}

            </>}
        </Box>
        <AddBookDialog
            open={addBookDialog}
            onSuccessfull={() => {
                reloadData(true);
                setAddBookDialog(false);
            }}
            onCloseReuqest={() => setAddBookDialog(false)}
        />
        <AddListDialog
            open={addListDialog}
            onSuccessfull={() => {
                reloadData(true);
                setAddListDialog(false);
            }}
            onCloseReuqest={() => setAddListDialog(false)}
        />
        <DefaultSignInDialog autoMode={props.user_id != '0'} />

        <MeikadeDrawer
            open={followingsDialog ? true : false}
            onClose={() => setFollowingsDialog(undefined)}
            anchor='bottom'
            title={t('user.followings')!}
        >
            <FollowList
                user={followingsDialog}
                reloadMethod={MkUserServices.followingsOfUser}
            />
        </MeikadeDrawer>

        <MeikadeDrawer
            open={followersDialog ? true : false}
            onClose={() => setFollowersDialog(undefined)}
            anchor='bottom'
            title={t('user.followers')!}
        >
            <FollowList
                user={followersDialog}
                reloadMethod={MkUserServices.followersOfUser}
            />
        </MeikadeDrawer>

        <MyAchievementsDialog
            open={globalAchievement}
            onClose={() => setGlobalAchievement(false)}
            userId={user?.id}
        />
    </Container>
})

const UserPage = () => {
    const params = useParams();
    return <UserPageBase user_id={params.user_id!} />
}

export default UserPage;