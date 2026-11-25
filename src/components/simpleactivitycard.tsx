import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, ButtonBase } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { showAchievement, showContentMenu } from '../layouts/mainframe';
import { globalBorderRadius, theme } from '../utils/theme';
import ActionCard from './actioncard';
import AvatarPoemCard from './avatarpoemcard';
import DatePoemCard from './datepoemcard';
import SimpeAchievementItem from './simpleachievementitem';
import { SimplePoemContent } from './simplepoemcard';
import UserFullname from './userfullname';

type SimpleActivityCardProps = {
    contentItem: SimplePoemContent,
    onReloadRequest: () => void,
};

const SimpleActivityCard = (props: SimpleActivityCardProps) => {
    const { t } = useTranslation();
    const content = props.contentItem;
    const achievement = content.activity?.target_user_achievement?.achievement;

    if (!achievement)
        return <></>

    const core = <>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            {content.owner && <>
                <AvatarPoemCard avatar={content.owner.avatar} size={22} userId={content.owner.username} />
                <UserFullname
                    user={content.owner}
                    customText={t('achievement.title').replaceAll('%1', (content.owner.firstname + ' ' + (content.owner.lastname ?? '')).trim())}
                    fontSize={'14px'}
                    sx={{
                        width: '100%',
                    }}
                />
            </>}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '30px' }}>
                <DatePoemCard createdAt={content.created_at} />
                <Button
                    sx={{
                        minWidth: 'unset',
                        height: '30px',
                        margin: '0px',
                    }}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.preventDefault()
                        showContentMenu(content, undefined, e, props.onReloadRequest ?? null);
                    }}
                >
                    <MoreHorizIcon sx={{ fontSize: 20, color: theme.palette.text.secondary, marginRight: 'auto' }} />
                </Button>
            </Box>
        </Box>
        {
            achievement && <SimpeAchievementItem achievement={achievement}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <ActionCard
                        contentItem={content}
                        achievementMode
                        onReloadRequest={props.onReloadRequest}
                    />
                </Box>
            </SimpeAchievementItem>
        }
    </>;

    const style = {
        display: 'flex',
        width: '100%',
        maxWidth: '100%',
        flexDirection: 'column',
        padding: '15px 15px 8px 15px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: globalBorderRadius,
        boxSizing: 'border-box',
        textAlign: 'unset',
        alignItems: 'start',
        gap: '5px',
    };

    if (achievement) {
        return <ButtonBase
            sx={style}
            disableRipple
            disableTouchRipple
            onClick={(e) => {
                if (e.defaultPrevented)
                    return;
                showAchievement({
                    achievement: achievement,
                    created_at: content.created_at,
                    count: 1,
                })
            }}
        >
            {core}
        </ButtonBase>
    } else {
        return <ButtonBase
            sx={style}
            disableRipple
            disableTouchRipple
            component={RouterLink}
            to={`/content/${content.id}`}
        >
            {core}
        </ButtonBase>
    }

}

export default SimpleActivityCard;
