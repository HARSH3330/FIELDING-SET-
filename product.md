# Fielding Set – Product Specification

## Overview
Fielding Set is a meme-style social platform where users upload photos of people
and the platform declares them "FIELDING SET".

The platform works similarly to a meme board such as Reddit or 9GAG
where users can browse posts, react, comment, and share.

The tone is humorous and internet meme culture focused.

---

# Core Concepts

Post = A "Fielding Set" declaration.

Each post contains:
- Image
- Name of person
- Optional caption
- Author
- Reactions
- Comments

---

# Key Features

## User Accounts

Users can:
- Sign up
- Log in
- Log out
- Edit profile
- View their posts

User profile includes:
- username
- avatar
- bio (optional)

---

## Post Creation

Users can create a post by uploading:

- Photo
- Name
- Caption (optional)

The system will display the post as:

[Photo]
Name

FIELDING SET

---

## Feed

The main feed shows posts sorted by:

- Trending
- New
- Top

Feed supports infinite scroll.

---

## Comments

Users can comment on posts.

Features:
- threaded replies
- upvote system
- delete own comments

---

## Reactions

Users can react to posts using meme reactions:

Reaction options:

- Squad Ready
- Location Received
- Standing By
- Watching

Users can react once per post.

---

## Sharing

Each post has a unique URL:

/post/{id}

Share buttons:

- Copy link
- WhatsApp
- Twitter

---

## Moderation

Admin capabilities:

- remove posts
- ban users
- remove comments
- flag inappropriate content

---

# Performance Goals

- fast feed loading
- optimized image delivery
- mobile-friendly design
- scalable backend APIs