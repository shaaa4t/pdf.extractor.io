# PDF Lesson Extractor

An interactive web application built with React and TypeScript for splitting a single PDF into multiple smaller PDF files. Users can visually select pages, group them into named "lessons," and download all the created lessons conveniently bundled into a single ZIP archive.

This tool runs entirely in the browser, ensuring user privacy as no files are uploaded to a server.

## ✨ Features

- **File Upload:** Drag-and-drop or click to upload a PDF file.
- **Visual Page Selection:** View thumbnails of all PDF pages and click to select them.
- **Lesson Grouping:** Group selected pages into distinct lessons with customizable names.
- **Color Coding:** Each lesson is assigned a unique color for easy visual identification.
- **Smart Naming:** Automatically increments lesson numbers for sequential lesson creation (e.g., `1-1`, `1-2`).
- **Download as ZIP:** Extracts all defined lessons into separate PDF files and downloads them as a single `.zip` archive.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **PDF Manipulation:** `pdf-lib` & `pdfjs-dist`
- **Styling:** TailwindCSS
- **Deployment:** GitHub Pages with GitHub Actions

## 🚀 Running Locally

Follow these steps to get the project running on your local machine.

**Prerequisites:**
- [Node.js](https://nodejs.org/en) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

**1. Clone the repository:**
```bash
git clone https://github.com/shaaa4t/pdf.extractor.io.git
cd pdf.extractor.io
```

**2. Install dependencies:**
```bash
npm install
```

**3. Run the development server:**
```bash
npm run dev
```
The application should now be running on the local address shown in your terminal.

## 🌐 Deployment to GitHub Pages

This repository is pre-configured for automated deployment to GitHub Pages. The workflow file at `.github/workflows/deploy.yml` will automatically build and deploy the application whenever you push changes to the `main` branch.

**Setup Steps:**
1. Push your code to your GitHub repository.
2. In your repository, go to **Settings > Pages**.
3. Under "Build and deployment", set the **Source** to **Deploy from a branch**.
4. Set the **Branch** to `gh-pages` and the folder to `/ (root)`.
5. Save the changes. The site will be deployed shortly after your next push.
