import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { alpha, Box, ButtonBase, CircularProgress, Container, Typography } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AvatarPoemCard from '../../components/avatarpoemcard';
import ContentTitle from '../../components/contenttitle';
import DatePoemCard from '../../components/datepoemcard';
import MeikadeAppBar from '../../components/meikadeappbar';
import SimpeAchievementListItem from '../../components/simpleachievementlistitem';
import UserFullname from '../../components/userfullname';
import { MkFullNotification } from '../../models/notification';
import { MkNotificationServices } from '../../services/notification';
import * as UserGlobal from "../../services/user-global";
import { globalBorderRadius, globalBorderRadiusValue, theme } from '../../utils/theme';
import { DefaultSignInDialog } from '../user/signin';

const NotificationsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [notifications, setNotifications] = React.useState<Array<MkFullNotification>>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 50;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const more = () => {
        reload(notifications.length);
    }

    const reload = async (offset: number) => {
        if (loadingRef.current)
            return;
        if (!UserGlobal.user)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (offset == 0)
                setNotifications([]);

            const result = await MkNotificationServices.getMyNotifications({ offset: offset, limit: limit });
            if (result.status && result.result) {
                setNotifications(offset > 0 ? [...notifications, ...result.result] : result.result);
                setHasMore(result.result.length == limit);
            }

            const seenResult = await MkNotificationServices.seenAllNotifications();
            if (seenResult.status && seenResult.result)
                await UserGlobal.reloadUser();
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        reload(0);
    }, []);

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    return <Container maxWidth="sm">
        <MeikadeAppBar />

        <Box
            sx={{
                marginTop: '75px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            {notifications.map((ntf: MkFullNotification) => {
                const user = ntf.actor_user ? ntf.actor_user : UserGlobal.user;
                if (!user)
                    return <></>;

                const core = <><Box
                    sx={{
                        minHeight: '40px',
                        minWidth: '2px',
                        background: theme.palette.primary.main,
                        opacity: ntf.seen ? 0 : 1,
                    }}
                />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'unset',
                            gap: '6px',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '10px',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <AvatarPoemCard avatar={user.avatar} userId={user.id} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <UserFullname
                                        user={user}
                                        fontWeight={700}
                                    />
                                    <Typography sx={{ opacity: 0.6, fontSize: '13px', marginTop: '-2px', direction: 'rtl', textAlign: 'left' }}>{'@' + user.username}</Typography>
                                </Box>
                            </Box>
                            <DatePoemCard createdAt={ntf.created_at} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <Typography sx={{ fontWeight: 700 }}>
                                {{
                                    1: t('notifications.description.thumbs_up'),
                                    2: t('notifications.description.thumbs_down'),
                                    3: t('notifications.description.comment'),
                                    4: t('notifications.description.review'),
                                    5: t('notifications.description.follow'),
                                    6: t('notifications.description.achievement'),
                                }[ntf.notification_type]}
                            </Typography>
                        </Box>
                        {ntf.user_achievement && ntf.user_achievement.achievement && <Box>
                            <SimpeAchievementListItem achievement={ntf.user_achievement.achievement} />
                        </Box>}
                        {ntf.content && <Box
                            sx={{
                                background: alpha(theme.palette.text.primary, 0.05),
                                padding: '10px',
                                borderRadius: (globalBorderRadiusValue / 2).toString() + 'px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {ntf.content && <ContentTitle
                                contentItem={ntf.content}
                                fontWeight={700}
                            />}
                            {(ntf.comment || ntf.review) && <Box
                                sx={{
                                    borderLeft: '2px solid ' + theme.palette.primary.main,
                                    padding: '4px 0px',
                                    paddingLeft: '8px',
                                    marginLeft: '4px',
                                }}
                            >
                                {ntf.comment && <Typography>{ntf.comment.comment}</Typography>}
                                {ntf.review && <Typography>{ntf.review.review}</Typography>}
                            </Box>}
                        </Box>}
                    </Box></>;

                const style = {
                    padding: '12px 20px 10px 6px',
                    background: theme.palette.background.paper,
                    borderRadius: globalBorderRadius,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '10px',
                };

                if (ntf.user_achievement) {
                    return <ButtonBase sx={style} >
                        {core}
                    </ButtonBase>
                } else {
                    return <ButtonBase
                        sx={style}
                        component={RouterLink}
                        to={ntf.content ? `/content/${ntf.content.id}` + (ntf.comment ? `/comments?comment=${ntf.comment.id}` : ntf.review ? `/reviews?review=${ntf.review.id}` : '') : `/user/${ntf.actor_user?.username}`}
                    >
                        {core}
                    </ButtonBase>
                }
            })}
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2, marginBottom: '100px' }}>
                {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: notifications.length == 0 ? '150px 0px' : '20px 10px' }} id="busy" />}
            </Box>
        </Box>
        <DefaultSignInDialog open={UserGlobal.user ? false : true} autoMode onClose={() => navigate('/')} />
    </Container>
}

export default NotificationsPage;