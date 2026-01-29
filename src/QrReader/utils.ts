export const isMediaDevicesSupported = () => {
  const isMediaDevicesSupported =
    typeof navigator !== 'undefined' && !!navigator.mediaDevices;

  if (!isMediaDevicesSupported) {
    console.warn(
      `[ReactQrReader]: MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"`
    );
  }

  return isMediaDevicesSupported;
};

export const isValidType = (value: any, name: string, type: string) => {
  const isValid = typeof value === type;

  if (!isValid) {
    console.warn(
      `[ReactQrReader]: Expected "${name}" to be a of type "${type}".`
    );
  }

  return isValid;
};

import { DeviceInfo } from '../types';

export const getDeviceInfo = (): DeviceInfo => {
  const hasNavigator = typeof navigator !== 'undefined';
  const userAgent = hasNavigator ? navigator.userAgent : undefined;
  const userAgentData = hasNavigator
    ? (navigator as any).userAgentData
    : undefined;
  const isTouchCapable =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (navigator?.maxTouchPoints ?? 0) > 0);
  const isCoarsePointer =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const uaMobileMatch = userAgent
    ? /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)
    : false;
  const userAgentDataMobile = userAgentData?.mobile;
  const isMobileLike = Boolean(
    userAgentDataMobile || uaMobileMatch || isCoarsePointer || isTouchCapable
  );

  const deviceType: DeviceInfo['deviceType'] = !hasNavigator
    ? 'unknown'
    : isMobileLike
    ? 'mobile'
    : 'desktop';

  return {
    deviceType,
    isMobileLike,
    isTouchCapable,
    userAgent,
    userAgentDataMobile,
    platform: hasNavigator ? navigator.platform : undefined,
  };
};
