import { alpha, Box, BoxProps, ButtonBase, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import AvatarPoemCard from '../../components/avatarpoemcard';
import FollowButton from '../../components/followbutton';
import UserFullname from '../../components/userfullname';
import { API } from "../../models/api";
import { MkUserWithBooks } from '../../models/book';
import { MkFullUser } from '../../models/user';
import { globalBorderRadius, theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

type FollowListProps = {
    user?: MkUserWithBooks,
    reloadMethod?: (user_id: number) => Promise<API<Array<MkFullUser>> | undefined>,
} & BoxProps;

const FollowList = (props: FollowListProps) => {
    const { t } = useTranslation();

    const [users, setUsers] = React.useState<Array<MkFullUser>>([]);
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const reload = async () => {
        if (!props.reloadMethod || !props.user) return;
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            setUsers([]);
            // await sleep(1000);
            const result = await props.reloadMethod(props.user.id);
            if (result && result.status && result.result) {
                setUsers(result.result);
                setError(undefined);
            } else if (result) {
                switch (result.message) {
                    case 'relation view failed':
                        setError(t('follows.permission-error')!);
                        break;
                    default:
                        setError(result.message);
                        break;
                }
                setUsers([]);
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        reload()
    }, [props.reloadMethod, props.user]);

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minHeight: '400px',
            ...props.sx,
        }}
    >
        {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '150px', marginBottom: '50px' }} id="busy" />}
        {!isLoading && props.user && <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {error && <Typography sx={{ textAlign: 'center', opacity: 0.8, padding: '20px' }}>{error}</Typography>}
                {users.map((user: MkFullUser, index: number) => {
                    return <Box
                        sx={{
                            borderTop: index ? '1px solid ' + alpha(theme.palette.text.primary, 0.1) : 'unset',
                        }}
                    >
                        <ButtonBase
                            sx={{
                                color: theme.palette.text.primary,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'unset',
                                padding: '6px 12px 6px 4px',
                                gap: '12px',
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: globalBorderRadius,
                                boxSizing: 'border-box',
                            }}
                            component={RouterLink}
                            to={`/user/${user.username}`}
                        >
                            <AvatarPoemCard avatar={user.avatar} size={37} innerSize={41} outerSize={45} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'start',
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
                                <Typography
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
                                </Typography>
                            </Box>
                            <FollowButton followed={user.followed ?? false} followed_you={user.followed_you ?? false} user_id={user.id} />
                        </ButtonBase>
                    </Box>
                })}
            </Box>
        </>}
    </Box>
}

export default FollowList;
