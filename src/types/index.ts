import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';

export type QrReaderProps = {
  /**
   * Media track constraints object, to specify which camera and capabilities to use
   */
  constraints?: MediaTrackConstraints;
  /**
   * Called when an error occurs.
   */
  onResult?: OnResultFunction;
  /**
   * Property that represents the view finder component
   */
  ViewFinder?: (props: any) => React.ReactElement<any, any> | null;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Enables attaching geolocation data to scan results
   */
  enableLocation?: boolean;
  /**
   * Options passed to the geolocation API
   */
  locationOptions?: PositionOptions;
  /**
   * Enables attaching device info to scan results
   */
  enableDeviceInfo?: boolean;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
  /**
   * Property that represents an optional className to modify styles
   */
  className?: string;
  /**
   * Property that represents a style for the container
   */
  containerStyle?: any;
  /**
   * Property that represents a style for the video container
   */
  videoContainerStyle?: any;
  /**
   * Property that represents a style for the video
   */
  videoStyle?: any;
};

export type OnResultFunction = (
  /**
   * The QR values extracted by Zxing
   */
  result?: Result | undefined | null,
  /**
   * The name of the exceptions thrown while reading the QR
   */
  error?: Error | undefined | null,
  /**
   * The instance of the QR browser reader
   */
  codeReader?: BrowserQRCodeReader,
  /**
   * Geolocation data captured at scan time (if enabled)
   */
  location?: GeoLocation | null,
  /**
   * Geolocation error (if location capture failed)
   */
  locationError?: GeolocationPositionError | Error | null,
  /**
   * Device info derived from browser heuristics (if enabled)
   */
  deviceInfo?: DeviceInfo | null
) => void;

export type GeoLocation = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

export type DeviceInfo = {
  deviceType: 'mobile' | 'desktop' | 'unknown';
  isMobileLike: boolean;
  isTouchCapable: boolean;
  userAgent?: string;
  userAgentDataMobile?: boolean;
  platform?: string;
};

export type UseQrReaderHookProps = {
  /**
   * Media constraints object, to specify which camera and capabilities to use
   */
  constraints?: MediaTrackConstraints;
  /**
   * Callback for retrieving the result
   */
  onResult?: OnResultFunction;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Enables attaching geolocation data to scan results
   */
  enableLocation?: boolean;
  /**
   * Options passed to the geolocation API
   */
  locationOptions?: PositionOptions;
  /**
   * Enables attaching device info to scan results
   */
  enableDeviceInfo?: boolean;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
};

export type UseQrReaderHook = (props: UseQrReaderHookProps) => void;
