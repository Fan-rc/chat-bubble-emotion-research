# Chat Bubble Emotion Matching Research Project

This is a web application designed for researching the matching between chat bubbles and emotional interpretations. Users will make a series of choices in this application, matching chat bubbles with emotional interpretations according to their perception. The results will be stored for research analysis.

## Project Structure

- `1.0banckground/`: Contains background and chat bubble image resources
- `2.0buttons/`: Contains button and emotion option image resources
- `3.0backend/`: Backend server
- `4.0frontend/`: Frontend application (user side)
- `5.0researcher_dashboard/`: Researcher dashboard (displaying statistical data)

## Running Instructions

### 1. Start the Backend Server

```bash
cd 3.0backend
npm install
npm run dev
```

The server will run on port 5001.

### 2. Start the Frontend Application (User Side)

```bash
cd 4.0frontend
npm install
npm start
```

The frontend application will run on port 3000 and automatically open in your browser.

### 3. Start the Researcher Dashboard

```bash
cd 5.0researcher_dashboard
npm install
npm start
```

Or run the script directly:

```bash
./5.0researcher_dashboard/start_dashboard.sh
```

The researcher dashboard will run on port 3001, displaying statistical data of all user choices.

## Usage Flow

### User Side (Port 3000):
1. Homepage: View research introduction, click the "Start" button
2. Introduction page: Read detailed research instructions, enter participant ID
3. Test pages (9 pages): Choose corresponding emotional interpretations for each chat bubble
4. Results page: View choice statistics and summary

### Researcher Dashboard (Port 3001):
1. Display participant statistics
2. Show emotional choice statistics for each chat bubble in descending order
3. Automatically refresh data every 30 seconds
4. Display format: "{Number} people think this bubble represents {emotion} emotion"

## Data Storage

User choices will be stored in the `data` directory on the backend:
- `sessions.json`: Saves session information
- `responses.json`: Saves user choices 