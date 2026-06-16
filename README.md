# RetrOS

RetrOS is a web-based, light retro operating system desktop interface simulated within a browser environment. It provides a classic, windowed multitasking feel utilizing basic frontend web technologies.

## Features & Included Applications

The system simulates a desktop environment with custom draggable window components and state persistence via localStorage. It currently includes the following tools:

* **MicroMemo:** A simple developer logging tool to create, store, and delete short text entries.
* **HobbyTrack:** An organizer application to log personal hobbies, filter entries, assign status tags, and rate activities.
* **PixelPaint:** A lightweight, interactive HTML5 Canvas drawing tool featuring custom brush colors and quick canvas clearing.
* **RetroPet:** A virtual pet simulator with persistent status tracking and automatic hunger decay over time.

## Local Installation & Usage

To run this project locally, no heavy backend framework or database installation is required.

1. Clone or download this repository to your workspace.
2. Ensure all project files (`index.html`, `script.js`, `style.css`) and associated image assets are stored in the same directory.
3. Open the `index.html` file directly in any modern web browser, or serve it using a lightweight local web server extension (such as Live Server in VS Code).

## Technical Overview

* **Frontend Architecture:** Pure semantic HTML5 markup styled with vanilla CSS.
* **Window Manager:** Custom vanilla JavaScript implementation handling dynamic z-indexing, basic selection states, window toggle states, and pointer-based drag-and-drop logic.
* **Data Persistence:** Client-side data retention across sessions managed natively through the browser's LocalStorage API.
