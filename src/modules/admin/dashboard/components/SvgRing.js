// SvgRing.js
import React from 'react';
import { Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * SvgRing - simple circular progress ring using react-native-svg + Animated
 *
 * props:
 *  - size: diameter (px)
 *  - strokeWidth
 *  - progress: 0..100
 *  - bgColor, progressColor
 */
export default function SvgRing({
  size = 64,
  strokeWidth = 6,
  progress = 0,
  bgColor = '#a98686ff',
  progressColor = '#4f46e5',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animated = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  // center coordinate
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size}>
      <G rotation="-90" origin={`${cx}, ${cy}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
      </G>
    </Svg>
  );
}
