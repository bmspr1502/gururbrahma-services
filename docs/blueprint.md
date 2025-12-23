# **App Name**: Gururbrahma Services

## Core Features:

- Admin Authentication: Secure admin portal with email/password authentication using Firebase Auth.
- Blog Post Management: CRUD operations for blog posts with a rich text editor and image upload to Firebase Storage.
- Video Management: Add YouTube video links (shorts or long-form), with auto-fetch of thumbnails where possible. Manual upload also possible. The thumbnails get stored to Firestore.
- Service Inquiry System: Form submissions for service requests saved to Firestore and trigger email notifications to the admin.
- Notification Ticker: A marquee banner or dismissible alert for displaying important announcements such as, for example, 'Upcoming Lunar Eclipse timings.'
- Admin Dashboard: Quick summary view of recent inquiries and website stats, displayed in the admin panel.
- Thumbnail Generation Tool: Use AI to decide, after analysis, whether to auto-generate video thumbnails from URLs, and auto-tag blog posts. The app should store all thumbnails in Cloud Storage

## Style Guidelines:

- Primary color: Deep purple (#6A1B9A) for navbars, footers, and primary buttons. Evokes spirituality and tradition.
- Secondary color: Vibrant pink/magenta (#D81B60) for accents, hover states, and CTAs. Adds a touch of modernity and energy.
- Highlight color: Golden yellow (#FBC02D) for icons, borders, and highlighting important text. Provides emphasis and draws the eye.
- Background color: Off-white or very light lavender to reduce eye strain while maintaining a clean and spiritual aesthetic.  HSL(250, 20%, 96%)
- Headline font: 'Playfair', serif, for headings to evoke authority and tradition. Note: currently only Google Fonts are supported.
- Body font: 'Inter', sans-serif, for body text for maximum readability. Note: currently only Google Fonts are supported.
- Use elegant and relevant icons to represent services and categories. Icons should primarily use the golden yellow (#FBC02D).
- Employ subtle background patterns like low-opacity Mandalas or Lotus motifs in white spaces.
- Utilize glassmorphism or soft shadows for service cards to create depth and a modern feel.
- Use subtle transitions and animations using Framer Motion for a smooth user experience.