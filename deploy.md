# Deployment Guide for Radio Le Temps de Dieu

## Pre-deployment Checklist ✅

### 1. Build Optimization
- ✅ Vite configuration optimized with chunk splitting
- ✅ Terser minification enabled with console removal
- ✅ Manual chunks for vendor libraries and icons
- ✅ Production build tested and working

### 2. Netlify Configuration
- ✅ netlify.toml configured with proper build settings
- ✅ Security headers added (X-Frame-Options, CSP, etc.)
- ✅ Cache headers for static assets
- ✅ SPA routing redirects configured
- ✅ Node.js version specified (v20)

### 3. Audio Streaming Optimization
- ✅ Enhanced error handling with retry logic
- ✅ Exponential backoff for connection failures
- ✅ User-friendly error messages
- ✅ Preconnect to audio stream domain
- ✅ CORS-ready configuration

### 4. Performance Optimizations
- ✅ Font preloading (Google Fonts)
- ✅ Asset preconnection
- ✅ Gzip compression headers
- ✅ Immutable cache for static assets
- ✅ Optimized bundle sizes:
  - Main bundle: ~179KB (57KB gzipped)
  - Vendor bundle: ~11KB (4KB gzipped)
  - Icons bundle: ~4KB (1.6KB gzipped)

### 5. SEO & Meta Tags
- ✅ Updated canonical URLs to Netlify domain
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card meta tags
- ✅ Structured data (JSON-LD)

## Deployment Commands

### Option 1: Automatic Deployment (Recommended)
1. Push changes to GitHub repository
2. Netlify will automatically build and deploy

### Option 2: Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Post-Deployment Verification

1. **Audio Streaming**: Test radio playback functionality
2. **Mobile Responsiveness**: Verify mobile interface
3. **Error Handling**: Test network failure scenarios
4. **Performance**: Check loading times and bundle sizes
5. **SEO**: Verify meta tags and social sharing

## Production URL
https://radio-tempsdedieu.netlify.app

## Key Features Preserved
- ✅ Live radio streaming from terranoradio-serveur.terranoweb.com
- ✅ Mobile-first responsive design
- ✅ Dark theme with custom colors
- ✅ Play/pause controls with loading states
- ✅ Auto-reconnection on stream interruption
- ✅ Error handling and user feedback
- ✅ Animated logo during playback
- ✅ Live indicator badge
