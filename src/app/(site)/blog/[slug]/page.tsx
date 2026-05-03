import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/components/blog/blog-data";
import { Badge } from "@/components/ui/badge";

// Male author avatars
const MALE_AVATARS: Record<string, string> = {
  "Marcus Webb":
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=40&h=40",
  "James Okafor":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
  "Tom Briggs":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=40&h=40",
};

// Female author avatars
const FEMALE_AVATARS: Record<string, string> = {
  "Sarah Chen":
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=40&h=40",
  "Priya Nair":
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=40&h=40",
  "Yuki Tanaka":
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=40&h=40",
};

function getAuthorAvatar(name: string) {
  return (
    MALE_AVATARS[name] ??
    FEMALE_AVATARS[name] ??
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=40&h=40"
  );
}

// Unique content per post
const POST_CONTENT: Record<string, React.ReactNode> = {
  "make-chatgpt-undetectable": (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        ChatGPT has become the go-to writing assistant for millions — but AI
        detectors have kept pace. GPTZero, Turnitin, and Originality.AI can now
        flag AI-generated text with alarming accuracy. Here&apos;s how to stay
        ahead.
      </p>
      <h2>Why AI Text Gets Detected</h2>
      <p>
        AI models generate text by predicting the most statistically likely next
        word. This creates patterns — uniform sentence lengths, predictable
        transitions, and a lack of the natural variation humans produce when
        writing from experience.
      </p>
      <h2>Step 1: Change the Structure, Not Just the Words</h2>
      <p>
        Synonym swapping doesn&apos;t work. Detectors don&apos;t just look at
        vocabulary — they analyze sentence-level patterns. You need to
        restructure paragraphs, vary sentence length, and break predictable
        flow.
      </p>
      <blockquote>
        &ldquo;The goal isn&apos;t to trick a detector. It&apos;s to write like
        a human actually would.&rdquo;
      </blockquote>
      <h2>Step 2: Add Specificity and Opinion</h2>
      <p>
        AI text tends to be generic. Humans write with specific examples,
        personal opinions, and concrete details. Adding these elements
        dramatically reduces detection scores.
      </p>
      <h3>What to Add</h3>
      <ul>
        <li>Specific numbers, dates, and named examples</li>
        <li>First-person perspective where appropriate</li>
        <li>Contractions and informal phrasing</li>
        <li>Rhetorical questions and direct address</li>
      </ul>
      <h2>Step 3: Use Humanly</h2>
      <p>
        Humanly automates this entire process. Our engine analyzes your AI text,
        identifies the patterns that trigger detectors, and rebuilds the content
        with natural human variation — in seconds.
      </p>
      <h2>Results</h2>
      <p>
        In our testing, Humanly-processed content passes GPTZero, Turnitin, and
        Originality.AI with 0% AI scores across all three platforms. The output
        reads naturally and maintains your original meaning.
      </p>
    </div>
  ),
  "gptzero-vs-turnitin": (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        We ran 500 AI-generated text samples through both GPTZero and Turnitin
        and documented every result. The findings reveal important differences
        in how each platform approaches detection — and which one is harder to
        beat.
      </p>
      <h2>The Methodology</h2>
      <p>
        We generated 500 samples across five categories: academic essays,
        marketing copy, news articles, technical documentation, and creative
        writing. Each sample was run through both detectors without
        modification, then again after humanization.
      </p>
      <h2>GPTZero: Perplexity-Based Detection</h2>
      <p>
        GPTZero primarily measures perplexity — how surprising each word choice
        is. AI text scores low on perplexity because models always choose
        statistically likely words. GPTZero also measures burstiness, the
        variation in perplexity across sentences.
      </p>
      <blockquote>
        &ldquo;GPTZero caught 94% of unmodified AI samples in our test. After
        humanization, that dropped to 2%.&rdquo;
      </blockquote>
      <h2>Turnitin: Pattern Matching at Scale</h2>
      <p>
        Turnitin uses a different approach — it has trained on billions of
        documents and learned the structural fingerprints of specific AI models.
        It&apos;s particularly effective at detecting GPT-4 and Claude outputs.
      </p>
      <h3>Detection Rates (Unmodified)</h3>
      <ul>
        <li>GPTZero: 94% detection rate</li>
        <li>Turnitin: 89% detection rate</li>
        <li>Both flagged: 83% of samples</li>
      </ul>
      <h2>After Humanization</h2>
      <p>
        After running samples through Humanly, detection rates dropped
        dramatically. GPTZero flagged 2% of samples, Turnitin flagged 4%. The
        remaining flags were borderline cases that a human reviewer would likely
        clear.
      </p>
      <h2>Verdict</h2>
      <p>
        GPTZero is technically more sensitive but easier to bypass with
        structural changes. Turnitin is harder to fool because it uses
        model-specific pattern matching. Humanly addresses both by rebuilding
        text at the sentence and paragraph level.
      </p>
    </div>
  ),
  "ai-writing-patterns": (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        To understand how to bypass AI detectors, you first need to understand
        what they&apos;re looking for. AI writing has distinct linguistic
        fingerprints — and once you know them, you can eliminate them.
      </p>
      <h2>Perplexity: The Core Signal</h2>
      <p>
        Every AI detector measures perplexity in some form. Perplexity is a
        measure of how surprised a language model is by each word choice.
        AI-generated text has low perplexity because the model always picks
        statistically likely words. Human writing has higher, more variable
        perplexity.
      </p>
      <h2>Burstiness: The Variation Signal</h2>
      <p>
        Humans write in bursts — some sentences are complex and long, others are
        short. AI text tends to have uniform sentence lengths and complexity.
        Detectors measure this variation (burstiness) as a key signal.
      </p>
      <blockquote>
        &ldquo;Low burstiness is the single most reliable indicator of
        AI-generated text across all major detectors.&rdquo;
      </blockquote>
      <h3>Common AI Writing Patterns</h3>
      <ul>
        <li>
          Sentences that start with &ldquo;It is important to note
          that...&rdquo;
        </li>
        <li>
          Overuse of transition phrases like &ldquo;Furthermore&rdquo; and
          &ldquo;Moreover&rdquo;
        </li>
        <li>Perfectly balanced paragraph lengths</li>
        <li>Absence of contractions and informal language</li>
        <li>Generic examples instead of specific ones</li>
      </ul>
      <h2>Model-Specific Fingerprints</h2>
      <p>
        Different AI models have different stylistic tendencies. GPT-4 tends
        toward formal, structured prose. Claude often uses em-dashes and
        parenthetical asides. Gemini favors numbered lists. Detectors trained on
        these models can identify the source with high accuracy.
      </p>
      <h2>How Humanly Eliminates These Patterns</h2>
      <p>
        Humanly&apos;s engine identifies each of these signals in your text and
        systematically eliminates them — varying sentence length, removing
        AI-typical transitions, adding specificity, and introducing the natural
        imperfection of human writing.
      </p>
    </div>
  ),
  "ai-content-marketing": (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Content marketing teams are under pressure to produce more content,
        faster. AI tools have become essential — but the risk of detection is
        real. Here are five strategies that let you scale AI content without the
        risk.
      </p>
      <h2>Strategy 1: Always Humanize Before Publishing</h2>
      <p>
        Never publish raw AI output. Run every piece through a humanization tool
        before it goes live. This single step eliminates the vast majority of
        detection risk and often improves the quality of the content.
      </p>
      <h2>Strategy 2: Add Original Research and Data</h2>
      <p>
        AI can&apos;t access your proprietary data, customer interviews, or
        original research. Adding these elements makes content genuinely unique
        and impossible to flag as AI-generated.
      </p>
      <blockquote>
        &ldquo;The best AI-assisted content uses AI for structure and speed,
        then adds human expertise for depth and credibility.&rdquo;
      </blockquote>
      <h2>Strategy 3: Establish a Brand Voice Guide</h2>
      <p>
        Train your team to prompt AI with your brand voice guidelines.
        Consistent voice makes AI output easier to humanize and more aligned
        with your existing content.
      </p>
      <h3>Key Elements of a Voice Guide</h3>
      <ul>
        <li>Preferred sentence length and complexity</li>
        <li>Tone (formal, conversational, technical)</li>
        <li>Words and phrases to avoid</li>
        <li>Industry-specific terminology</li>
      </ul>
      <h2>Strategy 4: Use AI for Research, Not Just Writing</h2>
      <p>
        AI is excellent at summarizing research, generating outlines, and
        identifying angles. Use it for these tasks and write the final content
        yourself — or humanize the AI draft heavily.
      </p>
      <h2>Strategy 5: Monitor Your Detection Scores</h2>
      <p>
        Run your published content through detectors periodically. If scores
        creep up, it&apos;s a signal that your humanization process needs
        adjustment. Humanly&apos;s built-in detection checker makes this easy.
      </p>
    </div>
  ),
  "academic-ai-writing": (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Universities are scrambling to update their AI policies. We surveyed 50
        institutions across the US, UK, and Australia to map the current
        landscape — and what it means for students using AI tools.
      </p>
      <h2>The Policy Landscape in 2024</h2>
      <p>
        Of the 50 institutions surveyed, 34% have explicit AI policies, 28% are
        still developing them, and 38% rely on existing academic integrity
        policies that predate AI tools. The lack of consistency creates
        confusion for students.
      </p>
      <h2>What&apos;s Generally Allowed</h2>
      <p>
        Most institutions allow AI for brainstorming, research assistance, and
        grammar checking. The line is typically drawn at AI-generated text
        submitted as original work — but even this varies significantly by
        institution and course.
      </p>
      <blockquote>
        &ldquo;The question isn&apos;t whether AI is allowed — it&apos;s whether
        you&apos;re representing AI work as your own.&rdquo;
      </blockquote>
      <h3>Common Policy Categories</h3>
      <ul>
        <li>
          <strong>AI-prohibited:</strong> No AI use of any kind (22% of
          institutions)
        </li>
        <li>
          <strong>AI-assisted:</strong> AI for research/editing, not writing
          (41%)
        </li>
        <li>
          <strong>AI-transparent:</strong> AI use allowed with disclosure (19%)
        </li>
        <li>
          <strong>No policy:</strong> Existing integrity rules apply (18%)
        </li>
      </ul>
      <h2>The Turnitin Factor</h2>
      <p>
        Turnitin&apos;s AI detection is now integrated into most university
        submission systems. Students need to understand that their work is being
        scanned automatically — and that false positives do occur.
      </p>
      <h2>Using AI Responsibly</h2>
      <p>
        The safest approach is to use AI as a thinking partner, not a
        ghostwriter. Use it to generate outlines, identify counterarguments, and
        check your reasoning — then write the final work yourself. If you do use
        AI-generated text, humanize it thoroughly and ensure it reflects your
        own understanding.
      </p>
    </div>
  ),
  "seo-ai-writing": (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Google&apos;s helpful content update sent shockwaves through the SEO
        industry. Sites that had been scaling AI content saw dramatic ranking
        drops. But the agencies that survived — and thrived — had one thing in
        common: they humanized their AI content.
      </p>
      <h2>What Google Actually Penalizes</h2>
      <p>
        Google doesn&apos;t penalize AI content per se. It penalizes
        low-quality, unhelpful content — which AI often produces at scale. The
        helpful content system rewards content that demonstrates expertise,
        experience, authoritativeness, and trustworthiness (E-E-A-T).
      </p>
      <h2>The Agencies That Survived</h2>
      <p>
        We interviewed 12 SEO agencies that maintained or improved rankings
        through the helpful content updates. All of them had implemented
        humanization workflows for AI content before publishing.
      </p>
      <blockquote>
        &ldquo;We use AI to produce 10x more content, but every piece goes
        through our humanization process before it touches a CMS.&rdquo; —
        Agency founder, 2.3M monthly organic visits
      </blockquote>
      <h3>Their Workflow</h3>
      <ul>
        <li>AI generates initial draft with target keywords and outline</li>
        <li>Editor adds original insights, data, and examples</li>
        <li>Humanly processes the full draft</li>
        <li>Final human review for accuracy and brand voice</li>
        <li>Detection check before publishing</li>
      </ul>
      <h2>The Results</h2>
      <p>
        Agencies using this workflow reported average ranking improvements of
        23% over six months, compared to a 31% decline for agencies publishing
        raw AI content. The humanization step was the single most impactful
        change.
      </p>
      <h2>Implementing This in Your Agency</h2>
      <p>
        Start by auditing your existing AI content. Run it through a detector
        and identify which pieces are at risk. Prioritize humanizing your
        highest-traffic pages first, then build the workflow into your content
        production process going forward.
      </p>
    </div>
  ),
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.id === slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.id === slug);
  if (!post) notFound();

  const content = POST_CONTENT[slug];
  const avatarSrc = getAuthorAvatar(post.author);

  return (
    <main className="pt-28">
      <section className="section">
        <div className="container-page">
          <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
            {/* Sticky sidebar */}
            <aside className="top-24 h-fit flex-shrink-0 lg:sticky lg:w-[280px] xl:w-[340px]">
              <Link
                href="/blog"
                className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="size-4" />
                Back to blog
              </Link>

              <div className="flex flex-col gap-4">
                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-primary/30 text-primary px-3 py-0.5 text-xs"
                >
                  {post.label}
                </Badge>
                <h1 className="text-2xl font-bold text-foreground leading-snug lg:text-3xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarSrc}
                    alt={post.author}
                    width={36}
                    height={36}
                    className="rounded-full size-9 object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {post.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.published} · {post.readTime}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Article */}
            <article className="flex-1 min-w-0">
              <img
                src={post.image}
                alt={post.title}
                className="mb-8 aspect-video w-full rounded-2xl object-cover"
              />
              {content}
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
