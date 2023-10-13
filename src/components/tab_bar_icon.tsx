import React from 'react'; // Import React
import {SvgProps} from 'react-native-svg';

interface TabBarIconProps {
  iconComponent: React.FC<SvgProps>;
  color: string;
  size?: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  iconComponent: IconComponent,
  color,
  size,
}) => <IconComponent width={size ?? 24} height={size ?? 24} fill={color} />;

export default TabBarIcon;
