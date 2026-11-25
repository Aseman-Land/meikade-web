import { alpha, Box, ButtonBase, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeDrawer, { MeikadeDrawerProps } from '../../components/meikadedrawer';
import SimpeAchievementListItem from '../../components/simpleachievementlistitem';
import { showAchievement } from '../../layouts/mainframe';
import { MkAchievementProgress, MkUserAchievement } from '../../models/achievement';
import { MkAchievementServices } from '../../services/achievement';
import { theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

export type AchievementProgressItem = {
    achievement: MkAchievementProgress,
    count: number,
    created_at?: Date,
};

export type MyAchievementsDialogProps = {
    userId?: number,
} & MeikadeDrawerProps;

const MyAchievementsDialog = (props: MyAchievementsDialogProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);
    const [achievements, setAchievements] = React.useState<AchievementProgressItem[]>([]);

    const reload = async () => {
        if (!props.userId) return;
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            await sleep(500);
            const achievements = await MkAchievementServices.getUserAchievements(props.userId);
            const achievementProgresses = await MkAchievementServices.getAchievementsProgresses();

            const achievementMap: Map<number, AchievementProgressItem> = new Map<number, AchievementProgressItem>();
            const achievementList: Array<AchievementProgressItem> = [];
            const achievementInserted: Array<number> = [];

            if (achievementProgresses.result) {
                achievementProgresses.result.forEach((ach: MkAchievementProgress) => {
                    const item = achievementMap.get(ach.id);
                    if (!item) {
                        achievementMap.set(ach.id, {
                            achievement: ach,
                            created_at: undefined,
                            count: 0,
                        });
                    }
                });
            }

            if (achievements.status && achievements.result) {
                achievements.result.forEach((ach: MkUserAchievement) => {
                    const item = achievementMap.get(ach.achievement_id);
                    if (item) {
                        item.count++;
                        item.created_at = ach.created_at;
                    } else if (ach.achievement) {
                        achievementMap.set(ach.achievement_id, {
                            achievement: {
                                ...ach.achievement,
                                is_completed: null,
                                progress_verses: null,
                                progress_duration: null,
                                progress_count: null,
                                progress_days: null,
                            },
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

            if (achievementProgresses.result) {
                achievementProgresses.result.forEach((ach: MkAchievementProgress) => {
                    const item = achievementMap.get(ach.id);
                    if (item && achievementInserted.indexOf(ach.id) < 0)
                        achievementList.push(item);
                });
            }

            setAchievements(achievementList);
        } catch { }
        loadingRef.current = false;
        setIsLoading(false);
    }

    const convertNumberToText = (num: number): string => {
        return (num >= 1_000_000
            ? `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
            : num >= 1_000
                ? `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                : num).toString();
    }

    const progressToAchievement = (prg: MkAchievementProgress) => {
        return {
            ...prg,
            books: [],
            users: [],
            contents: []
        };
    }

    const progressToPercent = (ach: MkAchievementProgress, completed: boolean): number => {
        var value = 1;
        var total = 1;
        if (ach.progress_duration != null && ach.min_duration && ach.min_duration > 0) {
            value = ach.progress_duration;
            total = ach.min_duration;
        } else if (ach.progress_days != null && ach.min_days && ach.min_days > 0) {
            value = ach.progress_days;
            total = ach.min_days;
        } else if (ach.progress_count != null && ach.min_count && ach.min_count > 0) {
            value = ach.progress_count;
            total = ach.min_count;
        } else if (ach.progress_verses != null && ach.min_verse_count && ach.min_verse_count > 0) {
            value = ach.progress_verses;
            total = ach.min_verse_count;
        }
        if (completed)
            value = total;
        return 100 * Math.min(1, value / total);
    }

    const progressToText = (ach: MkAchievementProgress, completed: boolean): string => {
        var value = 1;
        var total = 1;
        if (ach.progress_duration != null && ach.min_duration && ach.min_duration > 0) {
            value = ach.progress_duration;
            total = ach.min_duration;
        } else if (ach.progress_days != null && ach.min_days && ach.min_days > 0) {
            value = ach.progress_days;
            total = ach.min_days;
        } else if (ach.progress_count != null && ach.min_count && ach.min_count > 0) {
            value = ach.progress_count;
            total = ach.min_count;
        } else if (ach.progress_verses != null && ach.min_verse_count && ach.min_verse_count > 0) {
            value = ach.progress_verses;
            total = ach.min_verse_count;
        }
        if (completed)
            value = total;
        return t('achievements.progress')
            .replaceAll("%1", convertNumberToText(Math.min(value, total)))
            .replaceAll("%2", convertNumberToText(total));
    }

    React.useEffect(() => {
        if (props.open) {
            reload();
        }
    }, [props.open])

    return <MeikadeDrawer
        anchor='bottom'
        title={t('achievement.section')!}
        {...props}
    >
        <Box
            sx={{
                minHeight: '400px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '130px' }} id="busy" />}
            {!isLoading && <>
                {achievements.map((ach: AchievementProgressItem) => {
                    const percent: number = ach.count > 0 ? 100 : progressToPercent(ach.achievement, ach.count > 0);
                    const prgsText: string = progressToText(ach.achievement, ach.count > 0);
                    return <ButtonBase
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '4px',
                            alignItems: 'center',
                            width: '100%',
                        }}
                        onClick={() => {
                            if (ach.count > 0)
                                showAchievement({ ...ach, achievement: progressToAchievement(ach.achievement) })
                        }}
                    >
                        <SimpeAchievementListItem
                            achievement={progressToAchievement(ach.achievement)}
                            count={ach.count}
                            transparent
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: 'calc(100% - 20px)',
                                gap: '8px',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                    alignItems: 'start',
                                    height: '4px',
                                    borderRadius: '10px',
                                    background: alpha(theme.palette.text.primary, 0.1),
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${percent}%`,
                                        height: '100%',
                                        background: ach.achievement.color,
                                        borderRadius: '10px',
                                    }}
                                />
                            </Box>
                            <Typography
                                sx={{
                                    opacity: 0.7,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}
                            >
                                {prgsText}
                            </Typography>
                        </Box>
                    </ButtonBase>
                })}
            </>}
        </Box>
    </MeikadeDrawer>
}

export default MyAchievementsDialog;