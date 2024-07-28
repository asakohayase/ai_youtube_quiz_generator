<a name="readme-top"></a>

<h1>AI Youtube Quiz Generator</h1>

<div align="left">
  <p>
   Automatically Retrieve, Translate, and Summarize YouTube Transcripts to Generate Engaging Quiz Questions
  </p>
  
</div><img width="673" alt="Screenshot 2024-07-27 at 6 05 36 PM" src="https://github.com/user-attachments/assets/1dca0458-2b24-49cf-8b01-5790f91fed10">




<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
  </ol>
</details>


## Built With

* ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
* ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Get API Key at the following website
   * [https://platform.openai.com/](https://platform.openai.com/)
   
2. Clone the repo
   ```sh
   git clone https://github.com/asakohayase/youtube_quiz_generator
   ```
3. Install packages
   ```sh
   poetry install
   ```
   You have to install poetry if not already installed.
   
4. Enter your API keys in `.env`
   ```js
   OPENAI_API_KEY='ENTER YOUR API';
   ```
5. Activate the virtual environment
   ```sh
   poetry shell
   ```

### Usage

Backend:
To run the backend application, use the following command:

  ```sh
  python main.py
  ```

Frontend:
To start the frontend development server, run the following command in your terminal:

   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Roadmap
 <ol>
    <li>Support Other Languages</li>
    <li>Support Other LLM Models</li>
 </ol>


<p align="right">(<a href="#readme-top">back to top</a>)</p>
