import { MutableRefObject, useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { DeviceInfo, GeoLocation, UseQrReaderHook } from '../types';

import { getDeviceInfo, isMediaDevicesSupported, isValidType } from './utils';

// TODO: add support for debug logs
export const useQrReader: UseQrReaderHook = ({
  scanDelay: delayBetweenScanAttempts,
  constraints: video,
  onResult,
  videoId,
  enableLocation,
  locationOptions,
  enableDeviceInfo,
}) => {
  const controlsRef: MutableRefObject<IScannerControls> = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader(null, {
      delayBetweenScanAttempts,
    });
    const getLocation = () =>
      new Promise<{
        location: GeoLocation | null;
        locationError: GeolocationPositionError | Error | null;
      }>((resolve) => {
        if (!enableLocation || !navigator?.geolocation) {
          resolve({ location: null, locationError: null });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              location: {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  altitude: position.coords.altitude,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                },
                timestamp: position.timestamp,
              },
              locationError: null,
            });
          },
          (error) => {
            resolve({ location: null, locationError: error });
          },
          locationOptions
        );
      });

    const getDevice = (): DeviceInfo | null =>
      enableDeviceInfo ? getDeviceInfo() : null;

    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onResult(null, new Error(message), codeReader);
    }

    if (isValidType(video, 'constraints', 'object')) {
      codeReader
        .decodeFromConstraints({ video }, videoId, (result, error) => {
          if (isValidType(onResult, 'onResult', 'function')) {
            if ((enableLocation || enableDeviceInfo) && result && !error) {
              getLocation().then(({ location, locationError }) => {
                onResult(
                  result,
                  error,
                  codeReader,
                  location,
                  locationError,
                  getDevice()
                );
              });
              return;
            }

            onResult(result, error, codeReader, null, null, getDevice());
          }
        })
        .then((controls: IScannerControls) => (controlsRef.current = controls))
        .catch((error: Error) => {
          if (isValidType(onResult, 'onResult', 'function')) {
            onResult(null, error, codeReader);
          }
        });
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, []);
};
