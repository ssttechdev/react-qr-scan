import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ViewFinder } from './ViewFinder';

import { QrReader } from '../src';
import { QrReaderProps } from '../src/types';

const styles = {
  container: {
    width: '400px',
    margin: 'auto',
  },
};

const Template = (args: QrReaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  return (
    <div style={styles.container}>
      <QrReader
        {...args}
        onResult={(
          result,
          error,
          codeReader,
          locationResult,
          locationResultError,
          deviceInfoResult
        ) => {
          if (result) {
            setData(result);
          }

          if (error) {
            setError(error.message);
          }

          if (locationResult) {
            setLocation(locationResult);
          }

          if (locationResultError) {
            setLocationError(
              locationResultError instanceof Error
                ? locationResultError.message
                : locationResultError.message
            );
          }

          if (deviceInfoResult) {
            setDeviceInfo(deviceInfoResult);
          }
        }}
      />
      <p>The value is: {JSON.stringify(data, null, 2)}</p>
      <p>The error is: {error}</p>
      <p>The location is: {JSON.stringify(location, null, 2)}</p>
      <p>The location error is: {locationError}</p>
      <p>The device info is: {JSON.stringify(deviceInfo, null, 2)}</p>
    </div>
  );
};

const meta: Meta<typeof QrReader> = {
  title: 'Browser QR Reader',
  component: QrReader,
};

export default meta;

type Story = StoryObj<typeof QrReader>;

export const ScanCode: Story = {
  render: (args) => <Template {...args} />,
};

ScanCode.args = {
  ViewFinder,
  videoId: 'video',
  scanDelay: 500,
  enableLocation: true,
  enableDeviceInfo: true,
  constraints: {
    facingMode: 'user',
  },
};
