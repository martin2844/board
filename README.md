# Mate Board - Next.js Imageboard 🚀

A modern, fast imageboard application built with Next.js, featuring real-time search, image uploads, and a clean, responsive interface inspired by classic imageboards.

## 🌟 Features

- **Thread-based discussions** with nested replies
- **Image uploads** with S3 storage support
- **Advanced search** with SQLite FTS5 full-text search
- **Live search** with real-time dropdown results and keyboard navigation
- **Smart pagination** with ellipsis for large result sets
- **Responsive design** with mobile-friendly interface
- **File type support** for images (JPEG, PNG, GIF, WebP)
- **Anonymous posting** with unique user identification
- **Database migrations** and seeding for development

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **SQLite** with **Better-SQLite3** - Fast, embedded database
- **Knex.js** - SQL query builder and migration tool
- **SQLite FTS5** - Full-text search engine
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **AWS S3** - Cloud storage for images
- **dayjs** - Date manipulation library
- **Zod** - Runtime type validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS S3 bucket (for image uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd boards
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   S3_USERNAME=your_s3_username
   S3_PASSWORD=your_s3_password
   S3_URL=your_s3_endpoint_url
   ADMIN_TOKEN=your_admin_token
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate:latest
   ```

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application running!

## 📜 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint

### Database Management

- **`npm run migrate:make <name>`** - Create a new migration
- **`npm run migrate:latest`** - Run all pending migrations
- **`npm run migrate:rollback`** - Rollback the last migration batch
- **`npm run seed`** - Run database seeds

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

### Core Tables
- **`users`** - Anonymous user tracking by IP/device
- **`threads`** - Main discussion threads with optional images
- **`replies`** - Responses to threads with optional images

### Search Tables (FTS5)
- **`threads_fts`** - Full-text search index for threads
- **`replies_fts`** - Full-text search index for replies

### Key Features
- **Automatic FTS synchronization** via database triggers
- **Image metadata storage** (dimensions, file size, type)
- **Timestamp tracking** for creation and updates

## 🔍 Search Functionality

The application features a powerful search system:

### Live Search
- **Real-time search** with 300ms debounce
- **Dropdown results** showing up to 8 matches
- **Keyboard navigation** (↑↓ arrows, Enter, Escape)
- **Click-outside-to-close** functionality

### Full Search Page
- **Pagination** with smart ellipsis (1, 2, 3 ... 98, 99, 100)
- **Contextual snippets** with highlighted search terms
- **Combined results** from both threads and replies
- **Relevance ranking** using SQLite FTS5 scoring

### Search Features
- **Prefix matching** - "50 cha" matches "50 chars"
- **Full-text search** across all content
- **Highlighted results** with `<mark>` tags
- **Fallback LIKE queries** for non-FTS compatible searches

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── search/            # Search results page
│   └── thread/           # Thread detail pages
├── components/            # React components
│   ├── ui/               # Base UI components (buttons, etc.)
│   ├── Header/           # Navigation header
│   ├── ThreadCard/       # Thread display component
│   ├── CreateThread/     # Thread creation form
│   ├── LiveSearch/       # Real-time search component
│   └── Pagination/       # Smart pagination component
├── actions/              # Server actions
├── services/             # Business logic
│   ├── search.ts         # Search functionality
│   └── s3.ts            # S3 upload service
├── lib/                  # Utilities and configurations
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
├── migrations/           # Database migrations
└── seeds/               # Database seed files
```

## 🖼️ Image Upload

The application supports image uploads with the following features:

- **Multiple formats** - JPEG, PNG, GIF, WebP
- **File size limits** - Configurable per upload
- **Automatic resizing** - Using Sharp for optimization
- **S3 storage** - Scalable cloud storage
- **Metadata extraction** - Dimensions, file size, format

## 🎨 UI/UX Features

- **Responsive design** - Works on mobile and desktop
- **Clean aesthetics** - Inspired by classic imageboards
- **Loading states** - Visual feedback during operations
- **Error handling** - User-friendly error messages
- **Accessibility** - Keyboard navigation and screen reader support

## 🐳 Docker Support

Run the application using Docker:

```bash
# Build and run with Docker Compose
docker-compose up

# Or build manually
docker build -t boards .
docker run -p 3000:3000 boards
```

## 🧪 Development

### Seeding Test Data

The application includes comprehensive seed data:

- **100 users** with unique identifiers
- **1000 threads** with varied content and images
- **1000 replies** with searchable content
- **Realistic timestamps** spread over 6 months
- **Test search terms** like "tortilla" and "50 chars"

## 🔐 Protected Admin API

Use the `ADMIN_TOKEN` from `.env.local` as a bearer token to manage threads and replies.

### Endpoints

- `GET /api/admin/threads` - List threads (pagination with `page` and `limit`)
- `POST /api/admin/threads` - Create a thread
- `GET /api/admin/threads/:id` - Get thread with replies
- `PUT /api/admin/threads/:id` - Update thread
- `DELETE /api/admin/threads/:id` - Delete thread
- `GET /api/admin/replies` - List replies
- `POST /api/admin/replies` - Create a reply
- `GET /api/admin/replies/:id` - Get a reply
- `PUT /api/admin/replies/:id` - Update a reply
- `DELETE /api/admin/replies/:id` - Delete a reply

### Adding Migrations

Create a new migration:

```bash
npm run migrate:make add_new_feature
```

Example migration structure:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('new_table', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('new_table');
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by classic imageboard interfaces
- Built with modern web technologies
- Community-driven development approach

---

**Happy posting!** 🎉
