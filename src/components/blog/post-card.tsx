import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Post } from "./blog-data";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden p-0 gap-0">
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden">
        <Link
          href={post.url}
          className="block transition-opacity hover:opacity-80"
        >
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover object-center"
          />
        </Link>
      </div>

      <CardHeader className="pt-5 pb-2">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-2">
          <Badge
            variant="outline"
            className="rounded-full border-primary/30 text-primary text-[10px] px-2 py-0.5"
          >
            {post.label}
          </Badge>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" />
            {post.readTime}
          </span>
        </div>
        <Link href={post.url}>
          <h3 className="text-base font-bold text-foreground leading-snug hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-none">
          {post.summary}
        </p>
      </CardContent>

      <CardFooter className="pt-3 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3" />
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.published}</span>
        </div>
        <Link
          href={post.url}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Read more
          <ArrowRight className="size-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
