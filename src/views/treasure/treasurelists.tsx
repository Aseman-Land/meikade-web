import { ChevronLeft } from '@mui/icons-material';
import { Box, BoxProps, ButtonBase, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import AvatarPoemCard from '../../components/avatarpoemcard';
import FollowButton from '../../components/followbutton';
import UserFullname from '../../components/userfullname';
import { MkFullUser } from '../../models/user';
import { MkUserServices } from '../../services/user';
import { globalBorderRadius, theme } from '../../utils/theme';

type TreasureListsProps = {
    contentId?: number,
    verseId?: number,
    followMode?: boolean,
} & BoxProps;

const TreasureLists = (props: TreasureListsProps) => {
    const { t } = useTranslation();

    const [users, setUsers] = React.useState<Array<MkFullUser>>([]);
    const [keyword, setKeyword] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);
    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 50;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const more = () => {
        reload(users.length);
    }

    const reload = async (offset: number) => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (offset == 0)
                setUsers([]);
            const lists = await MkUserServices.search({
                limit: limit,
                offset: offset,
                keyword: keyword,
                sort_by_name: true,
            });
            if (lists.status && lists.result) {
                setUsers(offset > 0 ? [...users, ...lists.result] : lists.result);
                setHasMore(lists.result.length == limit);
            }
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

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            ...props.sx,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
            }}
        >
            {users.map((user: MkFullUser) => {
                const core = <>
                    {!props.followMode &&
                        <Box sx={{
                            width: '3px',
                            height: '30px',
                            borderRadius: '5px',
                            background: user.followed ? theme.palette.primary.main : 'transparent',
                        }} />
                    }
                    <AvatarPoemCard avatar={user.avatar} size={37} innerSize={41} outerSize={45} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            justifyContent: 'center',
                            gap: '4px',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <UserFullname
                                user={user}
                                fontSize={'15px'}
                            />
                        </Box>
                        {!props.followMode && <Typography
                            sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: '12px',
                                opacity: 0.7,
                                textAlign: 'justify',
                            }}
                        >
                            {user.about}
                        </Typography>}
                    </Box>
                    {props.followMode ?
                        <FollowButton disableFollowedYou followed={user.followed ?? false} followed_you={user.followed_you ?? false} user_id={user.id} />
                        :
                        <ChevronLeft sx={{ opacity: 0.8 }} />
                    }
                </>;

                const style = {
                    color: theme.palette.text.primary,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'unset',
                    alignItems: 'center',
                    padding: '12px 12px 12px 4px',
                    gap: '12px',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: globalBorderRadius,
                    boxSizing: 'border-box',
                };

                if (props.followMode) {
                    return <Box
                        sx={style}
                    >
                        {core}
                    </Box>
                } else {
                    return <ButtonBase
                        sx={style}
                        component={RouterLink}
                        to={`/user/${user.username}`}
                    >
                        {core}
                    </ButtonBase>
                }
            })}
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: users.length == 0 ? '40% 0px' : '20px 10px' }} id="busy" />}
            </Box>
        </Box>
    </Box>
}

export default TreasureLists;
