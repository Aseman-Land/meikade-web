import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps, Typography } from '@mui/material';
import { alpha, Box } from '@mui/system';
import { MkUserServices } from '../services/user';
import { theme } from '../utils/theme';

type FollowButtonProps = {
    followed: boolean,
    followed_you: boolean,
    disableFollowedYou?: boolean,
    user_id: number,
} & ButtonProps;

const FollowButton = (props: FollowButtonProps) => {
    const { t } = useTranslation();

    const [hovered, setHovered] = React.useState<boolean>(false);
    const [followed, setFollowed] = React.useState<boolean>(props.followed);
    const followedYou: boolean = props.followed_you;

    const loadingRef = React.useRef<boolean>(false);

    const [text, setText] = React.useState<string>('');

    React.useEffect(() => {
        if (followed) {
            setText((hovered ? t('follow-button.unfollow') : t('follow-button.following'))!)
        } else {
            setText(t('follow-button.follow')!)
        }
    }, [hovered, followedYou, followed]);

    const toggleFollow = async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;

        try {
            if (followed) {
                await MkUserServices.unfollow(props.user_id);
                setFollowed(false);
            } else {
                await MkUserServices.follow({ user_id: props.user_id });
                setFollowed(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            loadingRef.current = false;
        }
    }

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Button
            {...props}
            sx={{
                minWidth: '100px',
                padding: '6px',
                ...props.sx,
            }}
            variant={followed ? "contained" : "outlined"}
            disableElevation
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => {
                e.preventDefault();
                toggleFollow();
            }}
        >
            <Typography sx={{ fontSize: '12px' }}>{text}</Typography>
        </Button>
        {!props.disableFollowedYou && <Typography
            sx={{
                fontSize: '10px',
                background: alpha(theme.palette.text.primary, 0.07),
                padding: '4px 8px',
                borderRadius: '10px',
                opacity: followedYou ? 1 : 0,
            }}
        >
            {t('follow-button.followed-you')}
        </Typography>}
    </Box>;
}

export default FollowButton;
