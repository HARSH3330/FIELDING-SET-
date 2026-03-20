# API Routes – Fielding Set

Base API path:

/api

---

# Authentication

POST /api/auth/register
Create new user account

POST /api/auth/login
Login user and return JWT

POST /api/auth/logout
Logout user

GET /api/auth/me
Return current user

---

# Users

GET /api/users/:username
Fetch user profile

PUT /api/users/profile
Update profile

---

# Posts

GET /api/posts
Fetch feed posts

Query parameters:
?page=
&limit=
&sort=new|top|trending

POST /api/posts
Create a new post

GET /api/posts/:id
Fetch single post

DELETE /api/posts/:id
Delete post (author or admin)

---

# Comments

GET /api/comments/:postId
Fetch comments for a post

POST /api/comments
Create comment

DELETE /api/comments/:id
Delete comment

---

# Reactions

POST /api/reactions
React to post

Body:
post_id
reaction_type

DELETE /api/reactions/:id
Remove reaction

---

# Moderation

POST /api/flags
Report post

GET /api/admin/flags
View flagged posts (admin)

DELETE /api/admin/posts/:id
Remove post (admin)