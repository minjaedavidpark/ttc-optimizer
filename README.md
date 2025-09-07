# TTC Optimizer

A web application for optimizing Toronto Transit Commission (TTC) routes and schedules.

## Project Structure

- `backend/` - Python FastAPI backend for TTC data processing
- `web/` - Next.js frontend application
- `backend-requirements.txt` - Python dependencies

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- httpx
- gtfs-realtime-bindings
- pydantic-settings

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- ESLint

## Getting Started

### Backend Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend-requirements.txt

# Run the backend
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd web
npm install
npm run dev
```

## Development

This project is set up for full-stack development with:
- Hot reload for both frontend and backend
- TypeScript support
- ESLint configuration
- Tailwind CSS for styling

## License

MIT
