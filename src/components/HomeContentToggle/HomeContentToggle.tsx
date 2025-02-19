import { SegmentedControl, SegmentedControlItem, SegmentedControlProps } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { containerQuery } from '~/utils/mantine-css-helpers';

const homeOptions = {
  models: '/',
  images: '/images',
  videos: '/videos',
  posts: '/posts',
  articles: '/articles',
  bounties: '/bounties',
  events: '/events',
} as const;
type HomeOptions = keyof typeof homeOptions;

export function useHomeSelection() {
  const [home, setHome] = useLocalStorage<HomeOptions>({
    key: 'home-selection',
    defaultValue: 'models',
  });

  const url = homeOptions[home];
  const set = (value: HomeOptions) => {
    setHome(value);
    return homeOptions[value];
  };

  return { home, url, set };
}

/**
 * @deprecated Soon to be replaced by `FullHomeContentToggle`
 */
export function HomeContentToggle({ size, sx, ...props }: Props) {
  const router = useRouter();
  const { set } = useHomeSelection();
  const features = useFeatureFlags();

  const data: SegmentedControlItem[] = [
    { label: 'Models', value: 'models' },
    { label: 'Images', value: 'images' },
    { label: 'Videos', value: 'videos' },
    { label: 'Posts', value: 'posts' },
  ];
  if (features.articles) data.push({ label: 'Articles', value: 'articles' });
  if (features.bounties) data.push({ label: 'Bounties', value: 'bounties' });
  data.push({ label: 'Events', value: 'events' });

  return (
    <SegmentedControl
      {...props}
      sx={(theme) => ({
        ...(typeof sx === 'function' ? sx(theme) : sx),
      })}
      styles={(theme) => ({
        label: {
          [containerQuery.largerThan('xs')]: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      })}
      value={router.pathname.split('/').pop() || 'models'}
      onChange={(value) => {
        const url = set(value as HomeOptions);
        router.push(url);
      }}
      data={data}
    />
  );
}

type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
} & Omit<SegmentedControlProps, 'data' | 'value' | 'onChange'>;
