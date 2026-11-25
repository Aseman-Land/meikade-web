import { Check, LockOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { alpha, Box, BoxProps } from "@mui/system";
import { MkAchievement } from "../models/achievement";
import { storageBaseUrl } from "../utils/axios";
import { darkMode, globalBorderRadiusValue, theme } from "../utils/theme";

export type SimpeAchievementItemProps = {
    achievement: MkAchievement,
    count?: number,
    transparent?: boolean,
} & BoxProps;

const SimpeAchievementItem = (props: SimpeAchievementItemProps) => {

    const achievement = props.achievement;

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '36px',
            alignItems: 'center',
            backgroundColor: props.transparent ? 'transparent' : alpha(theme.palette.text.primary, 0.05),
            padding: '6px',
            width: '100%',
            borderRadius: `${globalBorderRadiusValue / 2}px`,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: '10px',
                marginTop: '4px',
            }}
        >
            <Typography
                sx={{
                    width: '100%',
                    fontWeight: 500,
                    textAlign: 'center',
                    fontSize: '15px',
                }}
            >
                {achievement.title}
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'start',
                    padding: '4px',
                    objectFit: 'cover',
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                    background: `url(${storageBaseUrl}${achievement.image})`,
                    backgroundColor: theme.palette.primary.light,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: `${darkMode ? 1 : 2}px solid ${achievement.color}`,
                    color: achievement.color,
                }}
            >
                {props.count == 0 && <Box
                    sx={{
                        position: 'absolute',
                        width: '100px',
                        height: '60px',
                        left: '10px',
                        top: '10px',
                        backgroundColor: "#000",
                        borderRadius: `${globalBorderRadiusValue / 2}px`,
                        border: `${darkMode ? 1 : 2}px solid ${achievement.color}`,
                        opacity: props.count > 0 ? 0 : 0.8,
                    }}
                />}
                {props.count != undefined &&
                    <Box
                        sx={{
                            background: alpha('#333', 0.7),
                            padding: '4px',
                            borderRadius: '4px',
                            zIndex: 10,
                        }}
                    >
                        {props.count == 0 && <LockOutlined sx={{ zIndex: 2, fontSize: '20px' }} />}
                        {props.count == 1 && <Check sx={{ zIndex: 2, fontSize: '20px' }} />}
                        {props.count > 1 && <Typography>{`+${props.count}`}</Typography>}
                    </Box>
                }
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'start',
                }}
            >
                <Typography
                    sx={{
                        marginLeft: '10px',
                        fontSize: '13px',
                        textAlign: 'center',
                    }}
                >
                    {achievement.description}
                </Typography>
            </Box>
        </Box>
        {props.children}
    </Box>;
}

export default SimpeAchievementItem;
