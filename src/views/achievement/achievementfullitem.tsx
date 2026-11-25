import { alpha, Box, Typography } from "@mui/material";
import { AchievementItem } from "../../components/achievementitemcard";
import { storageBaseUrl } from "../../utils/axios";
import { darkMode, globalBorderRadiusValue, theme } from "../../utils/theme";

export type AchievementFullItemProps = {
    achievement?: AchievementItem,

};

const AchievementFullItem = (props: AchievementFullItemProps) => {

    const achievement = props.achievement;

    return <Box
        sx={{
            display: 'flex',
            minWidth: '300px',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '18px 0px',
            gap: '18px',
        }}
    >
        {achievement && <>
            <Typography variant='h6'>{achievement.achievement.title}</Typography>
            <img
                src={`${storageBaseUrl}${achievement.achievement.image}`}
                alt=" "
                style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    display: 'block',
                    objectFit: 'cover',
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                    border: `${darkMode ? 1 : 2}px solid ${achievement.achievement.color}`,
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    minWidth: '300px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '18px 0px',
                    gap: '10px',
                }}
            >
                <Typography
                    sx={{
                        textAlign: 'center'
                    }}
                >
                    {achievement.achievement.description}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'center',
                        background: alpha(theme.palette.text.primary, 0.05),
                        padding: '10px',
                        borderRadius: `${globalBorderRadiusValue / 2}px`
                    }}
                >
                    {achievement.achievement.summery}
                </Typography>
            </Box>
        </>}
    </Box >;
}

export default AchievementFullItem;
