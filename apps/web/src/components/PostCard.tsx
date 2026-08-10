"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@blog/types";
import { formatDate } from "@/lib/utils";
import { getMediaUrl } from "@/lib/api";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const avatarUrl = getMediaUrl(post.author.image_path);

  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 mb-6 group">
      <div className="flex items-start gap-4">
        <Link href={`/users/${post.author.id}/posts`} className="flex-shrink-0">
          <Image
            src={avatarUrl || "/profile_pics/default.jpg"}
            alt={`${post.author.username}'s profile picture`}
            width={56}
            height={56}
            unoptimized
            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Link
              href={`/users/${post.author.id}/posts`}
              className="font-semibold text-foreground hover:text-primary transition-colors text-base"
            >
              {post.author.username}
            </Link>
            <span className="text-muted-foreground text-xs">•</span>
            <time className="text-xs text-muted-foreground">
              {formatDate(post.date_posted)}
            </time>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm line-clamp-4">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
};
