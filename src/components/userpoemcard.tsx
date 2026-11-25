import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, ButtonBase, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MkFullUser } from '../models/user';
import { theme } from "../utils/theme";
import AvatarPoemCard from "./avatarpoemcard";
import UserFullname from './userfullname';

const UserPoemCard = (props: { user: MkFullUser }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const user = props.user;
    const view = user.total_views;

    return <ButtonBase sx={{
        display: 'flex',
        width: '100px',
        height: '140px',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',

    }}
        component={RouterLink}
        to={`/user/${user.username}`}
    >

        <AvatarPoemCard avatar={user.avatar} size={60} innerSize={64} outerSize={70} userId={user.username} />
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '10px',

            }}>
                <UserFullname
                    user={user}
                    sx={{
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                />
            </Box>
            {view && <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '2px'
            }}
            >
                <Typography sx={{
                    display: 'flex',
                    fontSize: '12px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                >
                    {(view >= 1_000_000
                        ? `${(view / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
                        : view >= 1_000
                            ? `${(view / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                            : view)}
                </Typography>
                <VisibilityOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            </Box>}
        </Box>
    </ButtonBase>
}
export default UserPoemCard;