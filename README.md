# Klump Commerce

A modern e-commerce platform built with Nuxt 3, featuring product listings,
merchant management, and location-based shipping.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production Build

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Deployment

### Server-Side Rendering (SSR) - Production Deployment

For dynamic content and SEO optimization, deploy using SSR:

```bash
# Build for SSR
npm run build

# Start the production server
npm run start
```

**Deployment Options:**

#### 1. Traditional Server Deployment

- **PM2**: Process manager for Node.js applications
- **Nginx + Node.js**: Reverse proxy setup with Nginx
- **Apache + Node.js**: Using mod_proxy
- **Direct Node.js**: Running the built application directly

#### 2. Cloud Platform Deployment

- **Vercel**: Supports SSR with automatic deployments
- **Netlify**: Functions for server-side rendering
- **Railway**: Simple Node.js deployment
- **Render**: Managed Node.js hosting
- **DigitalOcean App Platform**: Managed Node.js applications

#### 3. Server Setup Example (Nginx + PM2)

**Install PM2:**

```bash
npm install -g pm2
```

**Start your application:**

```bash
pm2 start npm --name "klump-commerce" -- start
pm2 save
pm2 startup
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Environment Configuration

Create a `.env` file for production:

```env
# Production environment
NODE_ENV=production
NUXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NUXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Analytics
NUXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

### Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure environment variables
- [ ] Update API endpoints to production URLs
- [ ] Test build locally with `npm run preview`
- [ ] Verify all images and assets are loading
- [ ] Check shipping availability functionality
- [ ] Test checkout flow end-to-end
- [ ] Verify location-based features work correctly
- [ ] Set up PM2 or your preferred process manager
- [ ] Configure Nginx or reverse proxy
- [ ] Set up SSL certificates (Let's Encrypt recommended)
- [ ] Configure firewall and security settings

### Performance Optimization

- **Image Optimization**: Ensure all product images are optimized
- **Lazy Loading**: Implement lazy loading for product galleries
- **Caching**: Set up proper caching headers for static assets
- **CDN**: Use a CDN for global content delivery
- **Gzip Compression**: Enable compression in Nginx
- **PM2 Clustering**: Use PM2 cluster mode for multiple CPU cores

### Monitoring & Analytics

- **Process Management**: PM2 monitoring and restart on failure
- **Error Tracking**: Implement error monitoring (Sentry, LogRocket)
- **Performance Monitoring**: Use tools like Web Vitals
- **Analytics**: Configure Mixpanel or Google Analytics
- **Uptime Monitoring**: Set up uptime checks
- **Server Monitoring**: Monitor CPU, memory, and disk usage

## Additional Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
