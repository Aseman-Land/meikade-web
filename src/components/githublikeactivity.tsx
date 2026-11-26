import React, { useMemo } from "react";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MkActivitySummery, MkActivitySummeryDay, MkActivitySummeryUnit } from "../models/activity";
import { globalBorderRadiusValue } from "../utils/theme";

export type GitLikeActivityColors = {
    read?: string;
    write?: string;
    empty?: string;
    fallback?: string;
};

export type GitLikeActivityProps = {
    summery: MkActivitySummery;
    colors?: GitLikeActivityColors;
    showMonthLabels?: boolean;
    showTooltip?: boolean;
    cellSize?: number;
    cellGap?: number;
    daysCount?: number;
    sx?: SxProps<Theme>;
    style?: React.CSSProperties;
};

type JalaliDateParts = {
    year: number;
    month: number; // 1..12
    day: number; // 1..31
    monthName: string;
    jalaliWeekday: number;
};

type CalendarCell = {
    dateStr: string; // yyyy-MM-dd
    jalali: JalaliDateParts;
    readUnit?: MkActivitySummeryUnit;
    writeUnit?: MkActivitySummeryUnit;
    otherUnits: MkActivitySummeryUnit[];
};

type WeekColumn = {
    key: string;
    monthKey: string;
    monthName: string;
    rows: Array<CalendarCell | null>;
};

type MonthLabelMarker = {
    key: string;
    label: string;
    centerPx: number;
};

const DEFAULT_COLORS: Required<GitLikeActivityColors> = {
    read: "#2196f3",
    write: "#f44336",
    empty: "#ebedf0",
    fallback: "#4caf50",
};

const JALALI_MONTH_NAMES = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
];

function formatIsoDateLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function getJalaliParts(date: Date): JalaliDateParts {
    const formatter = new Intl.DateTimeFormat("en-u-ca-persian", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

    const parts = formatter.formatToParts(date);
    const year = Number(parts.find((p) => p.type === "year")?.value ?? 0);
    const month = Number(parts.find((p) => p.type === "month")?.value ?? 1);
    const day = Number(parts.find((p) => p.type === "day")?.value ?? 1);

    // 0 = شنبه .. 6 = جمعه
    const jalaliWeekday = (date.getDay() + 1) % 7;
    const monthName = JALALI_MONTH_NAMES[month - 1] ?? "";

    return {
        year,
        month,
        day,
        monthName,
        jalaliWeekday,
    };
}

function getActivityUnit(
    activities: MkActivitySummeryDay["activities"],
    key: string
): MkActivitySummeryUnit | undefined {
    if (!activities) return undefined;
    if (activities instanceof Map) {
        return activities.get(key);
    }
    return activities[key];
}

function getAllUnits(
    activities: MkActivitySummeryDay["activities"]
): MkActivitySummeryUnit[] {
    if (!activities) return [];
    if (activities instanceof Map) {
        return Array.from(activities.values());
    }
    return Object.values(activities);
}

const ActivityCell: React.FC<{
    cell: CalendarCell | null;
    size: number;
    colors: Required<GitLikeActivityColors>;
    showTooltip: boolean;
}> = ({ cell, size, colors, showTooltip }) => {
    const { t } = useTranslation();

    if (!cell) {
        return (
            <Box
                component="span"
                sx={{
                    display: "inline-block",
                    width: size,
                    height: size,
                    visibility: "hidden",
                }}
            />
        );
    }

    const hasRead = Boolean(cell.readUnit);
    const hasWrite = Boolean(cell.writeUnit);
    const other = cell.otherUnits[0];

    const jalaliFull = `${cell.jalali.day} ${cell.jalali.monthName} ${cell.jalali.year}`;

    const tooltipContent = useMemo(() => {
        if (!showTooltip) return "";

        const all = [
            ...(cell.readUnit ? [cell.readUnit] : []),
            ...(cell.writeUnit ? [cell.writeUnit] : []),
            ...cell.otherUnits,
        ];

        if (all.length === 0) {
            return `${jalaliFull} — ${t("activities.githubcomponent.empty")}`;
        }

        return (
            <Box sx={{ fontSize: 11, lineHeight: 1.5 }}>
                <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, display: "block", mb: 0.25 }}
                >
                    {jalaliFull}
                </Typography>
                {all.map((u) => (
                    <Box key={u.type}>
                        <strong>{u.type}</strong>: {u.count}{" "}
                        {t("activities.githubcomponent.count")} | {u.volume}{" "}
                        {t("activities.githubcomponent.volume")} | {u.duration}
                        {t("activities.githubcomponent.duration")}
                    </Box>
                ))}
            </Box>
        );
    }, [cell, jalaliFull, showTooltip, t]);

    const renderShape = () => {
        if (hasRead && hasWrite) {
            return (
                <Box
                    component="span"
                    sx={{
                        display: "inline-flex",
                        width: size,
                        height: size,
                        borderRadius: "2px",
                        overflow: "hidden",
                        cursor: showTooltip ? "pointer" : "default",
                    }}
                >
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <polygon points={`0,0 ${size},0 0,${size}`} fill={colors.read} />
                        <polygon
                            points={`${size},0 ${size},${size} 0,${size}`}
                            fill={colors.write}
                        />
                        <line
                            x1={size}
                            y1={0}
                            x2={0}
                            y2={size}
                            stroke="rgba(255,255,255,0.65)"
                            strokeWidth={0.8}
                        />
                    </svg>
                </Box>
            );
        }

        let fillColor = colors.empty;
        if (hasRead) {
            fillColor = colors.read;
        } else if (hasWrite) {
            fillColor = colors.write;
        } else if (other) {
            fillColor = colors.fallback;
        }

        return (
            <Box
                component="span"
                sx={{
                    display: "inline-block",
                    width: size,
                    height: size,
                    borderRadius: "2px",
                    backgroundColor: fillColor,
                    cursor: showTooltip ? "pointer" : "default",
                }}
            />
        );
    };

    if (!showTooltip) {
        return renderShape();
    }

    return (
        <Tooltip title={tooltipContent} arrow placement="top">
            {renderShape()}
        </Tooltip>
    );
};

export const GitLikeActivity: React.FC<GitLikeActivityProps> = ({
    summery,
    colors: customColors,
    showMonthLabels = true,
    showTooltip = false,
    cellSize = 10,
    cellGap = 2.5,
    daysCount = 365,
    sx,
    style,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const colors = useMemo(
        () => ({ ...DEFAULT_COLORS, ...customColors }),
        [customColors]
    );

    const dayMap = useMemo(() => {
        const map = new Map<string, MkActivitySummeryDay>();
        for (const item of summery?.list ?? []) {
            map.set(item.date, item);
        }
        return map;
    }, [summery]);

    const cells = useMemo<CalendarCell[]>(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const list: CalendarCell[] = [];

        for (let i = 0; i < daysCount; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            const dateStr = formatIsoDateLocal(d);
            const jalali = getJalaliParts(d);
            const dayData = dayMap.get(dateStr);

            list.push({
                dateStr,
                jalali,
                readUnit: dayData ? getActivityUnit(dayData.activities, "read") : undefined,
                writeUnit: dayData ? getActivityUnit(dayData.activities, "write") : undefined,
                otherUnits: dayData
                    ? getAllUnits(dayData.activities).filter(
                        (u) => u.type !== "read" && u.type !== "write"
                    )
                    : [],
            });
        }

        return list;
    }, [dayMap, daysCount]);

    const columns = useMemo<WeekColumn[]>(() => {
        if (cells.length === 0) return [];

        const cols: WeekColumn[] = [];
        let currentRows: Array<CalendarCell | null> = Array<CalendarCell | null>(7).fill(null);

        const finalizeColumn = (rows: Array<CalendarCell | null>) => {
            let newestCell: CalendarCell | null = null;
            for (let r = rows.length - 1; r >= 0; r--) {
                if (rows[r] !== null) {
                    newestCell = rows[r];
                    break;
                }
            }

            const anchor =
                newestCell ?? rows.find((c): c is CalendarCell => c !== null)!;

            cols.push({
                key: `col-${cols.length}-${anchor.dateStr}`,
                monthKey: `${anchor.jalali.year}-${anchor.jalali.month}`,
                monthName: anchor.jalali.monthName,
                rows,
            });
        };

        for (const cell of cells) {
            const rowIdx = cell.jalali.jalaliWeekday;
            currentRows[rowIdx] = cell;

            if (rowIdx === 0) {
                finalizeColumn(currentRows);
                currentRows = Array<CalendarCell | null>(7).fill(null);
            }
        }

        if (currentRows.some((c) => c !== null)) {
            finalizeColumn(currentRows);
        }

        return cols;
    }, [cells]);

    const monthMarkers = useMemo<MonthLabelMarker[]>(() => {
        if (!showMonthLabels || columns.length === 0) return [];

        const colStep = cellSize + cellGap;
        const spans: Array<{
            monthKey: string;
            label: string;
            startCol: number;
            endCol: number;
        }> = [];

        columns.forEach((col, idx) => {
            const lastSpan = spans[spans.length - 1];
            if (lastSpan && lastSpan.monthKey === col.monthKey) {
                lastSpan.endCol = idx;
            } else {
                spans.push({
                    monthKey: col.monthKey,
                    label: col.monthName,
                    startCol: idx,
                    endCol: idx,
                });
            }
        });

        const markers: MonthLabelMarker[] = [];
        let prevCenterPx = -Infinity;
        const minSpacingPx = 34;

        for (const span of spans) {
            const midCol = (span.startCol + span.endCol) / 2;
            const centerPx = midCol * colStep + cellSize / 2 - 10;

            if (centerPx - prevCenterPx >= minSpacingPx) {
                markers.push({
                    key: `${span.monthKey}-${span.startCol}`,
                    label: span.label,
                    centerPx,
                });
                prevCenterPx = centerPx;
            }
        }

        return markers;
    }, [columns, cellGap, cellSize, showMonthLabels]);

    return (
        <Box
            dir="rtl"
            style={style}
            sx={[
                {
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.75,
                    p: 1.25,
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                },
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${cellGap}px`,
                    width: "fit-content",
                }}
            >
                {showMonthLabels && (
                    <Box
                        sx={{
                            position: "relative",
                            height: 14,
                            width: `${columns.length * (cellSize + cellGap) - cellGap}px`,
                            userSelect: "none",
                            pointerEvents: "none",
                        }}
                    >
                        {monthMarkers.map((m) => (
                            <Typography
                                key={m.key}
                                variant="caption"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: `${m.centerPx}px`,
                                    transform: "translateX(50%)",
                                    lineHeight: "14px",
                                    fontSize: "0.625rem",
                                    color: theme.palette.text.secondary,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {m.label}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: `${cellGap}px`,
                        alignItems: "flex-start",
                    }}
                >
                    {columns.map((col) => (
                        <Box
                            key={col.key}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                width: `${cellSize}px`,
                                flexShrink: 0,
                                gap: `${cellGap}px`,
                            }}
                        >
                            {col.rows.map((cell, rowIdx) => (
                                <ActivityCell
                                    key={cell ? cell.dateStr : `${col.key}-empty-${rowIdx}`}
                                    cell={cell}
                                    size={cellSize}
                                    colors={colors}
                                    showTooltip={showTooltip}
                                />
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pt: 0.5,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    fontSize: "0.6875rem",
                    color: theme.palette.text.secondary,
                    flexWrap: "wrap",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                        component="span"
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "2px",
                            backgroundColor: colors.read,
                            display: "inline-block",
                            flexShrink: 0,
                        }}
                    />
                    <span>{t("activities.githubcomponent.read")}</span>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                        component="span"
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "2px",
                            backgroundColor: colors.write,
                            display: "inline-block",
                            flexShrink: 0,
                        }}
                    />
                    <span>{t("activities.githubcomponent.write")}</span>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                        component="span"
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "2px",
                            overflow: "hidden",
                            display: "inline-flex",
                            flexShrink: 0,
                        }}
                    >
                        <svg width={9} height={9} viewBox="0 0 9 9">
                            <polygon points="0,0 9,0 0,9" fill={colors.read} />
                            <polygon points="9,0 9,9 0,9" fill={colors.write} />
                        </svg>
                    </Box>
                    <span>{t("activities.githubcomponent.both")}</span>
                </Box>
            </Box>
        </Box>
    );
};

export default GitLikeActivity;
