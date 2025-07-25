# codetyp

codetyp is a sleek, modern web application designed to help developers test and improve their coding speed and accuracy. With a clean, dark-themed interface and real-time feedback, it provides an engaging way to practice typing code snippets in various programming languages.

**Live Demo:** [https://codetyp.netlify.app/](https://codetyp.netlify.app/)

![codetyp Results Screen](/public/Screenshot%202025-07-25%20at%202.56.02 PM.png)  

## ✨ Features

- **Multiple Languages:** Practice with code snippets from different programming languages, including JavaScript, Python, and HTML.
- **Real-Time Feedback:** Get instant WPM (Words Per Minute), accuracy, and error counts as you type.
- **Dynamic Text Scrolling:** The code display features a smooth, scrolling window that follows your cursor, keeping you focused on the upcoming text.
- **Detailed Results Analysis:** After each test, view a comprehensive results screen that includes:
    - Final WPM and accuracy scores.
    - Raw WPM calculation.
    - A breakdown of correct vs. incorrect characters.
- **Performance Graph:** Visualize your typing consistency with a line graph that plots your WPM and error count over the duration of the test.
- **Responsive Design:** A clean and responsive UI that works seamlessly on different screen sizes.

## 🚀 Tech Stack

- **Frontend:** [React](https://reactjs.org/)
- **Charting:** [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Styling:** Custom CSS with a modern, dark-themed aesthetic.

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or yarn) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/manasvihow/codetyp.git](https://github.com/manasvihow/codetyp.git)
    cd codetyp
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```
    This will install all the necessary dependencies, including React and Chart.js.

3.  **Run the application:**
    ```bash
    npm start
    ```
    This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload automatically when you make edits.

## 📁 File Structure

The project follows a standard React application structure:


```
/src
├── /components  
    └──  ResultsGraph.js # Component for the results chart
├── App.css      # Main stylesheet for the application
├── App.js       # Core application logic and state management
├── index.css    # Global styles
├── index.js     # Entry point for the React app
└── snippets.json   # Contains the code snippets for typing tests
```


Feel free to contribute to this project by forking the repository and submitting a pull request.
