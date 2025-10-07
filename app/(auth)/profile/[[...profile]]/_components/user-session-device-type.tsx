import {
  IconDeviceDesktop,
  IconDeviceGamepad,
  IconDeviceImac,
  IconDeviceImacX,
  IconDeviceMobile,
  IconDevicesX,
  IconDeviceTablet,
  IconDeviceTv,
  IconDeviceVisionPro,
  IconDeviceWatch,
} from '@tabler/icons-react';

interface UserSessionDeviceTypeProps {
  agentInfo: UAParser.IResult | null;
}

export default function UserSessionDeviceType(
  props: UserSessionDeviceTypeProps
) {
  const { agentInfo } = props;

  if (agentInfo == null)
    return (
      <IconDeviceImacX
        className={'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'}
      />
    );

  switch (agentInfo.device.type) {
    case 'mobile':
      return (
        <IconDeviceMobile
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'tablet':
      return (
        <IconDeviceTablet
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'smarttv':
      return (
        <IconDeviceTv
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'wearable':
      return (
        <IconDeviceWatch
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'console':
      return (
        <IconDeviceGamepad
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'desktop':
      return (
        <IconDeviceDesktop
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'embedded':
      return (
        <IconDeviceImac
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    case 'xr':
      return (
        <IconDeviceVisionPro
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );

    default:
      return (
        <IconDevicesX
          className={
            'size-8 sm:size-10 bg-accent-foreground/10 rounded-full p-2'
          }
        />
      );
  }
}
