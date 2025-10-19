import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { graphicsWorks, videoWorks } from '@/data/graphicsVideos';
import { Metadata } from 'next';
import { GraphicsGrid } from '@/components/graphics-videos/GraphicsGrid';
import { VideoGrid } from '@/components/graphics-videos/VideoGrid';

export const metadata: Metadata = {
  ...getMetadata('/graphics-videos'),
  title: 'Graphics & Videos - Dhanush',
  description: 'Explore my creative works in graphic design, Photoshop edits, and video production.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GraphicsVideosPage() {
  return (
    <Container className="py-16">
      <div className="space-y-12">
        {/* Page Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Graphics & Videos
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore my creative portfolio featuring graphic design, photo editing, and video production work.
          </p>
        </div>

        <Separator />

        {/* Graphics Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              🎨 Graphic Design & Photoshop
              {graphicsWorks.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({graphicsWorks.length}{' '}
                  {graphicsWorks.length === 1 ? 'work' : 'works'})
                </span>
              )}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Creative graphic design work including brand identity, UI/UX mockups, social media content, print materials, and digital illustrations using Photoshop and other design tools.
          </p>
          <GraphicsGrid works={graphicsWorks} />
        </div>

        <Separator />

        {/* Videos Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              🎬 Video Production
              {videoWorks.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({videoWorks.length}{' '}
                  {videoWorks.length === 1 ? 'video' : 'videos'})
                </span>
              )}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Video production work featuring promotional videos, brand storytelling, motion graphics, animated explainers, and social media content created with Premiere Pro, After Effects, and DaVinci Resolve.
          </p>
          <VideoGrid works={videoWorks} />
        </div>

        {/* Stats Section */}
        {(graphicsWorks.length > 0 || videoWorks.length > 0) && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {graphicsWorks.length}
                </p>
                <p className="text-sm text-muted-foreground">Graphic Works</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {videoWorks.length}
                </p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {graphicsWorks.filter(w => w.featured).length + videoWorks.filter(w => w.featured).length}
                </p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {new Set([...graphicsWorks, ...videoWorks].flatMap(w => w.tools || [])).size}
                </p>
                <p className="text-sm text-muted-foreground">Tools Used</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
