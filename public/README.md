# Public Assets Folder

This folder contains static assets that are served directly by Next.js.

## Files to Add:

### Logo
- **File:** `logo.png`
- **Recommended size:** 40x40px (for sidebar) or higher resolution (will be scaled)
- **Format:** PNG with transparent background
- **Location:** `/public/logo.png`
- **Usage:** Will be displayed in the sidebar logo area. If not found, "FL" text badge will be shown instead.

### Favicon
- **File:** `favicon.ico`
- **Recommended size:** 32x32px
- **Location:** `/public/favicon.ico`
- **Usage:** Browser tab icon

### Favicon PNG (Optional but Recommended)
- **File:** `favicon-16x16.png` (16x16px)
- **File:** `favicon-32x32.png` (32x32px)
- **Location:** `/public/favicon-16x16.png` and `/public/favicon-32x32.png`
- **Usage:** Higher quality favicon for different screen densities

### Apple Touch Icon (Optional)
- **File:** `apple-touch-icon.png`
- **Recommended size:** 180x180px
- **Location:** `/public/apple-touch-icon.png`
- **Usage:** Icon for iOS home screen when users add your app to their home screen

## How to Add Your Files:

1. Add your logo file as `logo.png` in this folder
2. Add your favicon file as `favicon.ico` in this folder
3. (Optional) Add additional favicon sizes and Apple touch icon
4. The app will automatically detect and use these files

## Notes:

- Files in the `/public` folder are accessible at the root URL (e.g., `/logo.png`, `/favicon.ico`)
- No need to import these files in your code - just reference them with `/filename.png`
- The logo will automatically fallback to "FL" text if `logo.png` doesn't exist
- Favicons are already configured in `app/layout.tsx`
