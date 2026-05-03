import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { AuroraText } from "@/components/ui/aurora-text";
import { PostCard } from "@/components/blog/post-card";
import { POSTS } from "@/components/blog/blog-data";

export const metadata = {
  title: "Blog",
  description:
    "Tips, guides, and research on AI writing, humanization, and bypassing AI detectors.",
};

export default function BlogPage() {
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  return (
    <main>
      {/* Hero */}
      <section
        aria-label="Blog hero"
        className="relative flex flex-col items-center justify-center overflow-hidden pt-32"
      >
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute rounded-full opacity-[0.15] blur-2xl"
            style={{
              width: "min(640px, 90vw)",
              height: "min(640px, 90vw)",
              background:
                "radial-gradient(circle, var(--primary) 0%, transparent 90%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="container-page relative z-10 flex flex-col items-center text-center gap-5">
          <BlurFade delay={0} duration={0.4} inView>
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Blog
            </Badge>
          </BlurFade>

          <BlurFade delay={0.1} duration={0.5} inView>
            <h1 className="text-balance max-w-3xl">
              Insights on AI writing & <AuroraText>detection</AuroraText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.5} inView>
            <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-balance mx-auto">
              Guides, research, and strategies for writers, students, and
              marketers navigating the AI content landscape.
            </p>
          </BlurFade>
        </div>

        {/* Featured post */}
        <div className="section container-page">
          <BlurFade delay={0.1} duration={0.5} inView>
            <a
              href={featured.url}
              className="group grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30 text-primary text-[10px] px-2 py-0.5"
                  >
                    {featured.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {featured.readTime}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-none">
                  {featured.summary}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {featured.author} · {featured.published}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    Read more <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </a>
          </BlurFade>
        </div>
      </section>

      {/* Post grid */}
      <section className="section pt-0">
        <div className="container-page">
          <BlurFade delay={0.2} duration={0.5} inView>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={0.3} duration={0.5} inView>
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                Load more articles
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
