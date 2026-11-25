import { HomeOutlined, MilitaryTech, PersonOutlined, SettingsOutlined, StarBorder } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import React from 'react';

export type IconName = 'home' | 'settings' | 'person';

const iconMap: Record<string, React.ComponentType<SvgIconProps>> = {
    home: HomeOutlined,
    settings: SettingsOutlined,
    person: PersonOutlined,
    star: StarBorder,
    medal: MilitaryTech,
};

interface MkDynamicIconProps extends SvgIconProps {
    name: string;
}

export const MkDynamicIcon: React.FC<MkDynamicIconProps> = ({ name, ...props }) => {
    const IconComponent = iconMap[name];
    if (!IconComponent) return null;
    return <IconComponent {...props} />;
};
