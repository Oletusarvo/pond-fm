# Amphitune Web App Logic Spec

This document describes the application logic implemented in the `apps/web` client, excluding all
styling and visual presentation behavior. It focuses on state, user flows, business rules, API
contracts, media handling, and app-wide orchestration.

## 1. Product Scope

Amphitune is a music platform centered on chronological listening and discovery. The web app allows
users to:

- sign up, sign in, and maintain authenticated sessions
- browse and search a catalog of tracks and genres
- play audio tracks and track listening sessions
- interact with tracks through likes, comments, shares, and follow activity
- manage personal profiles, social links, and notifications
- access subscription and billing-related features
- upload or manage audio content and metadata
- navigate the app through authenticated and public routes

The logic layer is responsible for data fetching, session state, audio playback state, user actions,
and business rules around permissions and content visibility.

## 2. Runtime Architecture

### 2.1 Client framework

The web app is a client-side application built with a modern React/Vite workflow. Logic is organized
around:

- route-level page components
- reusable feature modules and hooks
- API/service modules for backend communication
- local state and shared app state stores or context providers
- playback state and queue management

### 2.2 Core responsibilities

The logic layer manages:

- auth/session lifecycle and route protection
- loading and error states for async operations
- application-wide state updates for current user, library data, and playback
- orchestration between UI actions and backend API requests
- filtering, sorting, pagination, and search logic for catalog content
- optimistic UI updates for social actions like likes and follows

## 3. Domain Model

### 3.1 User

Users are the primary actor. User logic includes:

- signup and login flows
- session persistence across reloads
- update of profile fields and external URLs
- follow/unfollow actions
- notification visibility and read state
- permission checks for owner-only actions

Key user state usually includes:

- id
- email / username / display name
- avatar/media references
- bio / profile metadata
- subscription status
- follower/following counts
- role or administrative flags

### 3.2 Track

Tracks are the main content object. Logic covers:

- loading track metadata and audio URLs
- genre and mood assignment
- play count and stream session tracking
- track ownership and moderation status
- playback availability rules
- sorting/filtering by popularity, recency, genre, or mood

Track metadata usually includes:

- id
- title
- artist/creator references
- genre and mood tags
- duration
- upload metadata
- cover art URL
- audio source URL
- visibility/privacy flags

### 3.3 Genre and Mood

Catalog classification is central to discovery. Logic includes:

- loading available genres and mood types
- filtering tracks by these values
- deriving recommendations based on user preferences or recent listening history
- display and selection logic for exploration pages

### 3.4 Post and social content

The platform includes social publishing and engagement. Logic manages:

- creating posts associated with a user or track
- fetching user and feed timelines
- displaying media and content references
- likes, comments, and follow-based activity feeds
- moderation or visibility checks

### 3.5 Subscription and billing

The product includes subscription logic. Web-client behavior should include:

- loading plan and subscription state
- checking quota limits for uploads or streams
- surfacing upgrade paths and access gating
- handling billing-related success or failure states after redirect/callback flows
- marking expired or cancelled plans correctly

## 4. Authentication and Authorization Logic

### 4.1 Sign-up / sign-in flow

The app should provide authentication actions that:

- validate credentials and required fields
- submit auth requests to backend endpoints
- store tokens or session state after successful auth
- redirect authenticated users away from public auth screens
- surface errors for invalid credentials, expired sessions, or server faults

### 4.2 Session lifecycle

The auth logic must support:

- initial session hydration
- silent refresh or re-validation when a token expires
- logout cleanup of local state and cached user data
- route guards for protected pages
- restricted access to user-owned resources and private content

### 4.3 Authorization rules

Authorization logic should enforce that:

- users can only edit their own profiles and uploads
- only owners or admins can delete or hide content
- subscription-gated features are checked before use
- private or premium content is hidden or redirected appropriately

## 5. Navigation and Route Logic

The app is likely organized by screens and route groups. The logic should support:

- public pages: landing, sign-in, sign-up, public profile pages
- authenticated pages: library, feed, notifications, upload dashboard, settings
- content detail pages: track details, artist profile, post detail
- media/queue-driven pages: player, recent listens, liked tracks

Route logic includes:

- redirecting unauthenticated users to login
- preserving intended destination after login
- route parameter loading (user id, track id, album/playlist id)
- loading skeleton or fallback states while data resolves

## 6. Data Fetching and State Management

### 6.1 Server interactions

The web app communicates with backend API endpoints for:

- user and auth operations
- track catalog and media metadata
- uploads and file management
- follow/like notifications
- subscription, billing, and plan checks
- search and filtering results

The logic should centralize request lifecycle handling:

- request start / loading flags
- success handling and normalization of server payloads
- error mapping to user-visible messaging
- cancellation or retry behavior where relevant

### 6.2 Local state

App state should distinguish between:

- global app state: session, current user, app settings, notifications
- feature state: queue, current track, playback progress, search filters
- page state: form data, drafts, pagination, modal visibility

Shared logic should avoid duplicate fetches and keep cache freshness aligned with user actions.

## 7. Playback and Media Logic

### 7.1 Playback state

The player logic is central to the product and must handle:

- selecting a track and loading the track source
- queueing tracks from a library, playlist, or recommendation list
- playing, pausing, restarting, skipping, and seeking
- tracking current time and progress
- handling media playback errors and buffering states

### 7.2 Listening session tracking

When audio is played, the app should record or trigger stream/session events, including:

- play start
- track progress milestones
- completion or abandonment
- attribution to the correct user and track

This enables analytics and feed updates while preserving user privacy and platform rules.

### 7.3 Queue and recommendation logic

The app should support:

- auto-queueing from a selected list or search result
- shuffling and repeat modes if implemented
- next/previous navigation across the current queue
- maintaining playback continuity across route changes

## 8. Search, Discovery, and Catalog Logic

The catalog should support:

- keyword search across track titles, artists, genres, and metadata
- filtering by mood, genre, date, popularity, and user ownership
- sorting by newest, popular, most liked, or chronology-based signals
- pagination for large datasets
- empty-state behavior when no matches are found

Discovery logic may also include:

- “for you” recommendations based on recent activity
- trending or popular tracks
- genre or mood landing pages
- user-following-based feed or content suggestions

## 9. User Interaction Logic

### 9.1 Likes and reactions

Track or post engagement logic should handle:

- toggling like state
- optimistic UI updates
- syncing counts with backend responses
- preventing duplicate actions from repeated clicks
- locking actions during request in flight

### 9.2 Follow system

Follow logic should handle:

- follow/unfollow action on user profiles
- updating counts and follower lists
- checking access to follow-only content or recommendations
- preventing invalid self-follow actions

### 9.3 Notifications

The notification system should support:

- creation events from follows, likes, comments, or uploads
- unread counts and filter states
- marking as read individually or in bulk
- link navigation to the originating content or user

## 10. Upload and Content Management Logic

If upload workflows are implemented in the web app, the logic should manage:

- file selection and validation
- metadata entry (title, artist, genre, mood, description, tags)
- upload progress and failure handling
- linking uploaded audio to a user record and catalog entry
- visibility and moderation status transitions
- editing existing track metadata

Upload logic must include business rules for:

- file format and size constraints
- required fields before submission
- ownership checks before editing or deleting
- quota enforcement when applicable

## 11. Settings and Personalization Logic

User settings should include logic around:

- profile updates and URL management
- email update requests and verification workflows
- notification preferences
- media player preferences if implemented
- privacy controls for profile, activity, or follow visibility

A settings workflow should validate inputs and avoid partial updates that leave users in an invalid
state.

## 12. Error Handling and Loading States

The app logic should consistently handle:

- loading spinners or skeleton views while async work runs
- server errors mapped to actionable feedback
- empty states for no data, no following, no likes, or no search results
- retry paths for failed requests
- token expiry redirects
- permissions errors that block access to restricted content

## 13. Backend Contract Expectations

The web app is expected to integrate with a backend that exposes structured APIs for:

- authentication
- track CRUD operations
- user data and profile data
- feed and social actions
- playback analytics and session tracking
- subscriptions and quotas
- notifications and messaging

The web logic should treat these endpoints as authoritative and normalize backend responses before
they affect UI state.

## 14. Expected User Flows

### 14.1 First-time user

- sign up
- confirm account or session creation
- land on a suggested library/feed screen
- discover tracks and follow creators
- play music and engage with content

### 14.2 Returning user

- authenticate automatically or restore session
- load personalized library and notifications
- browse recent or recommended content
- play from recommendations or saved queue
- update profile or upload content if enabled

### 14.3 Premium or subscribed user

- verify plan and quota access
- unlock premium-only content or higher limits
- manage billing state and plan changes
- continue using core functionality without hidden gating issues

## 15. Non-Goals / Out of Scope

The following are intentionally excluded from this logic spec because they are not core application
logic:

- CSS, layout, spacing, and visual themes
- animation timing and graphical polish
- branding assets, illustration design, and icon styling
- accessibility styling details unless they affect behavior or focus management

## 16. Summary

The Amphitune web application is a media-rich, social music platform with authentication, discovery,
playback, user interaction, catalog management, and subscription logic. The logic layer coordinates
client-side state, backend API calls, user permissions, and content workflows while leaving visual
implementation details to the styling layer.
