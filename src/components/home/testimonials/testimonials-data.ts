export interface Testimonial {
  name: string;
  role: string;
  username: string;
  avatar: string;
  body: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Content Marketer",
    username: "@sarahchen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Humanly completely changed my workflow. GPTZero used to flag almost everything I touched — now it passes cleanly. The tone feels natural, and honestly, my clients think I just got better at writing.",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    role: "PhD Student",
    username: "@marcuswebb",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Turnitin kept catching my AI-assisted drafts. After using Humanly, the difference is night and day. It actually sounds like my own voice now, which is exactly what I needed.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Freelance Writer",
    username: "@priyanair",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80",
    body: "I was skeptical at first, but the output is surprisingly human. It smooths out awkward phrasing without killing creativity. Plus, my SEO performance stayed stable, which I was worried about.",
    rating: 4,
  },
  {
    name: "James Okafor",
    role: "Startup Founder",
    username: "@jamesokafor",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80",
    body: "We use Humanly for investor updates and blog content. Originality.ai consistently gives us high human scores. It saves hours every week and keeps our messaging sharp.",
    rating: 5,
  },
  {
    name: "Leila Ahmadi",
    role: "Email Copywriter",
    username: "@leilaahmadi",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80",
    body: "My email campaigns feel more personal now. Open rates jumped significantly after switching to Humanly. The tone is warmer and less robotic.",
    rating: 5,
  },
  {
    name: "Tom Briggs",
    role: "SEO Agency Owner",
    username: "@tombriggs",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Running an agency means scaling content fast. Humanly lets us do that without worrying about detection. It’s not perfect every time, but it’s the best tool we’ve used so far.",
    rating: 3,
  },
  {
    name: "Yuki Tanaka",
    role: "Academic Researcher",
    username: "@yukitanaka",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Copyleaks used to flag my drafts occasionally. With Humanly, I feel much more confident submitting work. It keeps the academic tone intact while removing AI patterns.",
    rating: 5,
  },
  {
    name: "Amara Diallo",
    role: "Social Media Manager",
    username: "@amaradiallo",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Content creation is way faster now. I generate ideas with AI, refine them with Humanly, and publish. Engagement has improved, especially on captions.",
    rating: 3,
  },
  {
    name: "Ryan Kowalski",
    role: "Technical Writer",
    username: "@ryankowalski",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Technical writing usually exposes AI instantly, but Humanly handles it surprisingly well. It keeps clarity while removing that generic AI tone.",
    rating: 5,
  },
  {
    name: "Nina Petrov",
    role: "Blogger",
    username: "@ninapetrov",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Publishing multiple posts a week used to burn me out. Now I can draft quickly and refine with Humanly. It’s not just faster — it actually sounds better.",
    rating: 5,
  },
  {
    name: "David Osei",
    role: "Marketing Consultant",
    username: "@davidosei",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=80&h=80",
    body: "I’ve recommended Humanly to several clients already. It speeds up content production without sacrificing quality. That’s a rare combo.",
    rating: 3,
  },
  {
    name: "Fatima Al-Hassan",
    role: "Grant Writer",
    username: "@fatimaah",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Grant writing requires a very human tone. Humanly helps transform rough AI drafts into something that actually feels authentic and persuasive.",
    rating: 3,
  },
  {
    name: "Lucas Meyer",
    role: "SaaS Copywriter",
    username: "@lucasmeyer",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=80&h=80",
    body: "I’ve tried a few humanizers before, but most just reword things awkwardly. Humanly actually improves flow and readability. It feels like editing, not just spinning.",
    rating: 5,
  },
  {
    name: "Emily Carter",
    role: "Student",
    username: "@emilywrites",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=80&h=80",
    body: "I use AI for first drafts, but professors can tell instantly. Humanly fixes that. My submissions now sound way more natural and personal.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "Startup Marketer",
    username: "@arjunpatel",
    avatar:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&q=80&w=80&h=80",
    body: "We produce a lot of landing page copy. Humanly helps us move fast without sacrificing quality. It still needs a quick review, but it gets us 90% there.",
    rating: 3,
  },
  {
    name: "Sophie Laurent",
    role: "UX Writer",
    username: "@sophielaurent",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=80&h=80",
    body: "What I like most is how it removes that 'AI stiffness'. The text feels more conversational and aligned with real user tone.",
    rating: 5,
  },
  {
    name: "Daniel Kim",
    role: "Product Manager",
    username: "@danielkim",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=80&h=80",
    body: "We use AI a lot internally, but communication matters. Humanly helps polish docs and updates so they don’t sound robotic.",
    rating: 4,
  },
  {
    name: "Isabella Rossi",
    role: "Blogger",
    username: "@isabellarossi",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=80&h=80",
    body: "My blog tone is very personal, so I was worried AI would ruin that. Humanly actually keeps the personality intact while improving clarity.",
    rating: 3,
  },
  {
    name: "Noah Williams",
    role: "YouTube Script Writer",
    username: "@noahwrites",
    avatar:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Scripts need to sound natural when spoken. Humanly makes AI drafts way more conversational and easier to read aloud.",
    rating: 5,
  },
  {
    name: "Hassan Ali",
    role: "Agency Copy Lead",
    username: "@hassanali",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=80&h=80",
    body: "We tested Humanly against multiple detectors. Results were consistently solid. It’s now part of our standard workflow.",
    rating: 3,
  },
  {
    name: "Maya Singh",
    role: "LinkedIn Ghostwriter",
    username: "@mayasingh",
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=80&h=80",
    body: "LinkedIn content needs to feel authentic. Humanly helps remove generic phrasing and makes posts feel more personal.",
    rating: 4,
  },
  {
    name: "Ethan Brooks",
    role: "Newsletter Writer",
    username: "@ethanbrooks",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&q=80&w=80&h=80",
    body: "My newsletter open rates improved after switching. The tone feels more human and less templated.",
    rating: 3,
  },
  {
    name: "Olivia Green",
    role: "Copy Editor",
    username: "@oliviagreen",
    avatar:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=80&h=80",
    body: "I still edit everything, but Humanly reduces my workload significantly. It gets rid of the obvious AI patterns.",
    rating: 4,
  },
  {
    name: "Victor Mendes",
    role: "Ecommerce Owner",
    username: "@victormendes",
    avatar:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80&w=80&h=80",
    body: "Product descriptions feel more engaging now. Customers actually spend more time reading them.",
    rating: 3,
  },
];
