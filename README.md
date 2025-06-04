# AI Data Assistant Chatbot UI

A modern, responsive chatbot interface built with Angular 18 and Tailwind CSS that integrates with a Python backend API for data insights and SQL query generation.

## Features

- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 💬 **Chat Interface**: Real-time messaging with smooth animations
- 📊 **Data Visualization**: Responsive tables for query results
- 🔍 **SQL Display**: Syntax-highlighted SQL query display
- 💡 **Insights**: Formatted AI-generated insights
- 📱 **Mobile Responsive**: Works seamlessly across all devices
- 💾 **Message Persistence**: Chat history saved in localStorage
- ⚡ **Real-time Status**: Connection status and loading indicators
- 🔄 **Error Handling**: Graceful error handling and user feedback

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v18 or higher)
- Python backend API running on `http://localhost:8000`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Tailwind CSS (Already configured)

The project already includes Tailwind CSS configuration. If you need to reinstall:

```bash
npm install --save-dev tailwindcss postcss autoprefixer
```

### 3. Configure Backend API

Update the API URL in `src/app/services/chat.service.ts`:

```typescript
private readonly apiUrl = 'http://your-backend-url/api';
```

### 4. Run the Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── chat.component.ts       # Main chat interface
│   │   └── message.component.ts    # Individual message display
│   ├── services/
│   │   └── chat.service.ts         # API communication service
│   ├── app.component.ts            # Root component
│   ├── app.component.html          # Root template
│   ├── app.config.ts               # App configuration
│   └── app.routes.ts               # Routing configuration
├── styles.css                      # Global styles with Tailwind
└── index.html                      # Main HTML file
```

## API Integration

The application expects a Python backend with the following endpoint:

### POST `/api/process-question`

**Request:**
```json
{
  "question": "string"
}
```

**Response:**
```json
{
  "status": "valid",
  "message": null,
  "sql_query": "SELECT * FROM table_name;",
  "insight": "Here's what the data shows...",
  "data": [
    {"column1": "value1", "column2": "value2"},
    {"column1": "value3", "column2": "value4"}
  ]
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "sql_query": "",
  "insight": "",
  "data": []
}
```

## Customization

### Styling

The application uses Tailwind CSS for styling. Key customizations can be made in:

- `tailwind.config.js` - Theme configuration, colors, animations
- `src/styles.css` - Global styles and custom scrollbar

### API Configuration

Update the following in `src/app/services/chat.service.ts`:

- `apiUrl`: Your backend API base URL
- Error handling logic
- Request/response interfaces

### UI Components

- `ChatComponent`: Main chat interface, handles user input and message flow
- `MessageComponent`: Individual message display with different layouts for user/bot messages

## Development

### Building for Production

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
ng test
```

### Code Formatting

The project includes ESLint and Prettier configurations. Run:

```bash
ng lint
```

## Features in Detail

### Chat Interface
- Auto-scrolling to latest messages
- Message persistence across sessions
- Real-time typing indicators
- Connection status monitoring

### Message Display
- User messages: Right-aligned blue bubbles
- Bot responses: Left-aligned white cards with structured content
- Loading states with animated indicators
- Error states with clear messaging

### Data Tables
- Responsive design with horizontal scrolling
- Zebra striping for better readability
- Sticky headers for large datasets
- Empty state handling

### SQL Display
- Dark theme code blocks
- Syntax highlighting styling
- Copy-friendly formatting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
