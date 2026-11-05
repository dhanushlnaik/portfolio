'use client';

import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import GithubIcon from '../svgs/Github';
import { Button } from '../ui/button';

const ActivityCalendar = dynamic(
  () => import('react-activity-calendar').then((mod) => mod.default),
  { ssr: false },
);

type ContributionItem = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export default function Github() {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${githubConfig.apiUrl}/${githubConfig.username}?y=last`,
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: {
          total?: Record<string, number>;
          contributions?: ContributionItem[];
        } = await response.json();

        const items = (data.contributions ?? []).filter(
          (c) => typeof c?.date === 'string' && typeof c?.count === 'number',
        );
        if (items.length === 0) {
          setHasError(true);
        } else {
          setContributions(items);
          setTotalContributions(
            data.total?.lastYear ?? items.reduce((sum, c) => sum + c.count, 0),
          );
        }
      } catch (err) {
        console.error('Failed to fetch GitHub contributions:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Container className="mt-20">
      <div className="space-y-6">
        <SectionHeading
          index="05"
          heading="Commits"
          note={
            !isLoading && !hasError && totalContributions > 0
              ? `${totalContributions.toLocaleString()} contributions on GitHub as @${githubConfig.username}`
              : `GitHub activity for @${githubConfig.username}`
          }
          href={`https://github.com/${githubConfig.username}`}
          hrefLabel="GitHub"
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                {githubConfig.loadingState.description}
              </p>
            </div>
          </div>
        ) : hasError || contributions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <GithubIcon className="w-8 h-8" />
            </div>
            <p className="font-medium mb-2">{githubConfig.errorState.title}</p>
            <p className="text-sm mb-4">
              {githubConfig.errorState.description}
            </p>
            <Button variant="outline" asChild>
              <Link
                href={`https://github.com/${githubConfig.username}`}
                className="inline-flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                {githubConfig.errorState.buttonText}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="relative rounded-xl border p-4 sm:p-6">
              <div className="w-full overflow-x-auto ">
                <ActivityCalendar
                  data={contributions}
                  blockSize={10}
                  blockMargin={3}
                  fontSize={githubConfig.fontSize}
                  colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                  maxLevel={githubConfig.maxLevel}
                  hideTotalCount={true}
                  hideColorLegend={false}
                  hideMonthLabels={false}
                  theme={githubConfig.theme}
                  labels={{
                    months: githubConfig.months,
                    weekdays: githubConfig.weekdays,
                    totalCount: githubConfig.totalCountLabel,
                  }}
                  style={{
                    color: 'rgb(139, 148, 158)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
