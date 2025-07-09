# MVP Requirements: Anonymous Rant/Joy Sharing Web App

To rapidly launch the anonymous rant/joy sharing web app, focusing on a **Minimum Viable Product (MVP)** is crucial. The following core features are essential for the initial release:

---

## 1. Anonymous Posting & Submission

- **Anonymous User Session**  
  Users can access and use the app without creating an account or providing personal information. Supabase anonymous authentication will handle this in the background.

- **Text Input Area**  
  A clear and accessible text field for users to type their *rant* or *perfect day* entry.

- **Category Selection**  
  A simple mechanism (e.g., radio buttons or dropdown) to select whether the post is a **Rant** or a **Perfect Day**.

- **Submission Button**  
  A prominent button to submit the entry.

---

## 2. Content Viewing

- **Feed Display**  
  A main feed that displays recent anonymous posts.

- **Content Display**  
  Each post should clearly show its content and category (**Rant** / **Perfect Day**).  
  No personally identifying information (e.g., user IDs, timestamps) should be visible to users.  
  Timestamps will be used internally for post ordering only.

- **Filtering**  
  Ability to filter posts to show only **Rants** or only **Perfect Days**.

- **Scrolling/Loading**  
  Basic functionality to view more posts as the user scrolls (e.g., simple pagination or infinite scroll).

---

## 3. Technical Foundation

- **Frontend**: NextJS, Tailwind CSS, shadcn/ui
- **Backend/Database**: Supabase  
- **Authentication**: Supabase Anonymous Authentication  
- **Security Rules**: Managed via Supabase

---

## 4. Non-Functional Essentials

- **Absolute Anonymity**  
  Ensure no Personally Identifiable Information (PII) is collected or displayed.

- **Responsiveness**  
  Fully functional and visually appealing on both mobile and desktop devices.

- **Usability**  
  The interface should be intuitive and easy to use for first-time visitors.

---

## MVP Focus

This MVP prioritizes the **core value proposition**:  
- Providing a safe and anonymous outlet for expression  
- Offering a simple way to view shared experiences  

✨ *Future features like moderation tools, sentiment analysis, or reaction buttons can be considered in later iterations.*
