# PDF Lesson Extractor

An interactive web application built with React and TypeScript for splitting a single PDF into multiple smaller PDF files. Users can visually select pages, group them into named "lessons," and download all the created lessons conveniently bundled into a single ZIP archive.

This tool runs entirely in the browser, ensuring user privacy as no files are uploaded to a server.

## ✨ Features

### 📥 Multiple Input Options
- **File Upload:** Drag-and-drop or click to upload a PDF file from your computer.
- **URL Loading:** Load PDFs directly from URLs without downloading them first.
  - **Direct Fetch:** Fast loading from CORS-friendly URLs.
  - **CORS Proxy Support:** Optional proxy mode to bypass CORS restrictions.
  - **Smart Error Handling:** Automatic detection of CORS issues with helpful suggestions.
  - **Progress Tracking:** Real-time progress bar shows download percentage.

### 📄 PDF Processing
- **Visual Page Selection:** View thumbnails of all PDF pages and click to select them.
- **Lesson Grouping:** Group selected pages into distinct lessons with customizable names.
- **Color Coding:** Each lesson is assigned a unique color for easy visual identification.
- **Smart Naming:** Automatically increments lesson numbers for sequential lesson creation (e.g., `1-1`, `1-2`).
- **Download as ZIP:** Extracts all defined lessons into separate PDF files and downloads them as a single `.zip` archive.

### 🔒 Privacy & Security
- **Client-Side Processing:** All PDF processing happens in your browser - no server uploads.
- **Privacy Warnings:** Clear warnings when using CORS proxy mode.
- **No Data Storage:** Your PDFs are never stored or sent to any server (except when using proxy mode).

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

## 📖 How to Use

### Method 1: Upload a PDF File
1. Click the **Upload File** tab
2. Drag and drop a PDF file or click to browse
3. Wait for page thumbnails to generate

### Method 2: Load from URL
1. Click the **Load from URL** tab
2. Paste a direct PDF URL (e.g., `https://example.com/document.pdf`)
3. Click **Load PDF** to fetch the file
4. **If CORS error occurs:**
   - A suggestion box will appear
   - Click "Enable proxy and retry" or check "Use CORS proxy"
   - Try loading again (proxy mode is slower but bypasses restrictions)

### Creating Lessons
1. Click on page thumbnails to select them
2. Selected pages will be highlighted in blue
3. Click **Add Lesson** to create a lesson from selected pages
4. Rename lessons by clicking on the lesson name
5. Delete lessons using the trash icon
6. Click **Extract & Download** to get your ZIP file

## 🌐 Deployment to GitHub Pages

This repository is pre-configured for automated deployment to GitHub Pages using GitHub Actions. The workflow file at `.github/workflows/deploy.yml` will automatically build and deploy the application whenever you push changes to the `main` branch.

**Setup Steps:**
1. Push your code to your GitHub repository.
2. In your repository, go to **Settings > Pages**.
3. Under "Build and deployment", set the **Source** to **GitHub Actions**.
4. Save the changes. The site will be deployed automatically on your next push to `main`.

Your site will be available at: `https://[your-username].github.io/[repository-name]/`

## 🔧 Understanding CORS and Proxy Mode

### What is CORS?
CORS (Cross-Origin Resource Sharing) is a browser security feature that prevents websites from fetching resources from different domains. Many PDF hosting services don't allow direct access from web applications.

### When to Use Proxy Mode?
- ✅ **Use Direct Fetch when:**
  - Loading from your own servers
  - Public CDNs and CORS-friendly services
  - Educational resources (like w3.org)

- ⚠️ **Use Proxy Mode when:**
  - You get CORS errors
  - Loading from Google Drive, Dropbox, or similar services
  - Academic papers from university servers
  - **Note:** Avoid using proxy for sensitive/private documents

### How the Proxy Works
When enabled, your PDF URL is routed through a public CORS proxy service (corsproxy.io). This service fetches the PDF on your behalf and sends it to your browser, bypassing CORS restrictions.

## ❓ Troubleshooting

### URL Loading Issues

**Problem:** "Network error. This may be due to CORS restrictions"
- **Solution:** Enable "Use CORS proxy" checkbox and try again

**Problem:** "PDF not found (404)"
- **Solution:** Verify the URL points directly to a PDF file
- Make sure the URL ends with `.pdf` or returns a PDF file
- Test the URL in your browser first

**Problem:** "The URL does not point to a PDF file"
- **Solution:** Some URLs redirect or serve HTML instead of PDFs
- Try copying the direct PDF link (right-click → Copy Link Address)

**Problem:** Proxy mode is slow
- **Solution:** This is normal - proxy adds extra network hop
- For better performance, download the PDF and use Upload tab

### General Issues

**Problem:** Thumbnails not generating
- **Solution:** Ensure the PDF is not corrupted or password-protected
- Try a different PDF to verify the application works

**Problem:** Build fails locally
- **Solution:**
  - Delete `node_modules` and run `npm install` again
  - Make sure you have Node.js v18+ installed
  - Check that all Tailwind config files exist

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- PDF processing powered by [pdf-lib](https://pdf-lib.js.org/) and [PDF.js](https://mozilla.github.io/pdf.js/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- CORS proxy provided by [corsproxy.io](https://corsproxy.io/)

---

Made with ❤️ by the community
