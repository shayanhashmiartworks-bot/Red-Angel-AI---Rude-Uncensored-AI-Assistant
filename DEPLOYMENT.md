# 🎮 Red Angel Portfolio - Neon Database Deployment

## 🌐 Setup Instructions

### 1. **Database Setup**
1. Go to your Neon Database dashboard
2. Run the SQL from `database-schema.sql` to create the artworks table
3. Note your `NETLIFY_DATABASE_URL` connection string

### 2. **Netlify Environment Variables**
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add: `NETLIFY_DATABASE_URL` = your Neon connection string

### 3. **Deploy to Netlify**
1. Push your code to GitHub
2. Netlify will automatically deploy
3. The functions will be available at:
   - `/.netlify/functions/get-artworks`
   - `/.netlify/functions/add-artwork`
   - `/.netlify/functions/delete-artwork`

## 🎯 How It Works

### **Upload Process:**
1. User uploads image via admin panel
2. Image gets optimized and uploaded to hosting
3. Image data saved to Neon database
4. All visitors see the new image instantly

### **Viewing Process:**
1. Website loads artworks from Neon database
2. All visitors see the same images
3. Real-time updates for everyone

## 🚀 Features

- ✅ **Real-time updates** - New uploads appear for all visitors
- ✅ **Persistent storage** - Images stay forever in database
- ✅ **Cross-device sync** - Works on any device/browser
- ✅ **Admin controls** - Upload/delete images
- ✅ **8-bit retro theme** - Maintains your aesthetic

## 🔧 Troubleshooting

### **If images don't load:**
1. Check Netlify Functions logs
2. Verify `NETLIFY_DATABASE_URL` is set
3. Check database connection

### **If uploads fail:**
1. Check browser console for errors
2. Verify function deployment
3. Check database permissions

## 📱 Mobile Support

- ✅ **Responsive design** - Works on all devices
- ✅ **Touch interactions** - Mobile-friendly admin panel
- ✅ **Fast loading** - Optimized for mobile

Your website is now a real social network! 🎮🌐
