<img width="1920" height="1080" alt="Screenshot 2026-04-18 144206" src="https://github.com/user-attachments/assets/ffda448c-5d90-4333-8be1-57fc81d399bb" />
<img width="1920" height="1080" alt="Screenshot 2026-04-18 140447" src="https://github.com/user-attachments/assets/ed59da62-0f53-48fe-8a96-e61baaaf0c75" />
<img width="1920" height="1080" alt="Screenshot 2026-04-18 140509" src="https://github.com/user-attachments/assets/0724325d-397b-4f36-871d-8e368b71bed2" />
<img width="1920" height="1080" alt="Screenshot 2026-04-18 140520" src="https://github.com/user-attachments/assets/7992eb9d-b122-4599-9ab1-fa468d3d600b" />
<img width="1920" height="1080" alt="Screenshot 2026-04-18 140540" src="https://github.com/user-attachments/assets/4cb4d788-0654-4478-b3fe-a5b1f8ce592b" />
<img width="1920" height="1080" alt="Screenshot 2026-04-18 140622" src="https://github.com/user-attachments/assets/92a6ab38-36a0-406a-af6d-9af8bb3ad79a" />
<img width="1920" height="1080" alt="Screenshot 2026-04-18 140638" src="https://github.com/user-attachments/assets/e9eba6b2-e7f5-4ae3-b2f1-08227f3fee23" />
# DataVault - Code Sharing Platform

A modern full-stack web application for sharing and discovering code snippets with real-time syntax highlighting and collaborative features.

## 🚀 Features

- **Code Snippet Sharing** - Create, edit, and share code snippets
- **Syntax Highlighting** - Monaco Editor with multi-language support
- **User Authentication** - Secure registration and login system
- **Public/Private Snippets** - Control visibility of your code
- **Like System** - Like and favorite community snippets
- **Trending Section** - Discover popular snippets from the community
- **Modern UI** - Beautiful glassmorphism design with Tailwind CSS
- **Responsive Design** - Works perfectly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Monaco Editor** - Code editor
- **React Query** - Data fetching
- **Wouter** - Routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Passport.js** - Authentication

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/datavault.git
cd datavault
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/datavault
NODE_ENV=development
SESSION_SECRET=your-secret-key-here
PORT=5000
```

### 4. Set up the database
```bash
# Create the database
createdb datavault

# Run migrations
npm run db:push
```

### 5. Build and start the application
```bash
# Build the frontend
npm run build

# Start the development server
npm run dev
```

### 6. Open your browser
Navigate to `http://localhost:5000`

## 📁 Project Structure

```
datavault/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication logic
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
└── dist/                  # Built frontend files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate migrations

## 🚀 Deployment

### Environment Variables for Production
```env
DATABASE_URL=your-production-database-url
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret
PORT=5000
```

### Deploy to platforms like:
- **Vercel** - Frontend and serverless functions
- **Railway** - Full-stack deployment
- **Heroku** - Traditional hosting
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by GitHub Gist and CodePen
- UI components from Radix UI
- Icons from Lucide React

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/datavault](https://github.com/yourusername/datavault)
