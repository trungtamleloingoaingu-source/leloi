import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSY3y-AWYYg5QM3p2mZ94MAuhBqpHKY6M",
    authDomain: "web-nnll.firebaseapp.com",
    databaseURL: "https://web-nnll-default-rtdb.firebaseio.com",
    projectId: "web-nnll",
    storageBucket: "web-nnll.firebasestorage.app",
    messagingSenderId: "760353962724",
    appId: "1:760353962724:web:172850525b0daf94f1caf1",
    measurementId: "G-09MJMYGH4J"
  };
export const app = initializeApp(firebaseConfig); 
export const db = getDatabase(app);

window.GITHUB_CONFIG = {
    TOKEN: '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',
    OWNER: 'trungtamleloingoaingu-source',
    REPO: 'leloi-upload',
    FOLDER: 'uploads',
    BRANCH: 'main'
};

window.uploadImageToGitHub = async (file) => {
    return new Promise((resolve, reject) => {
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const fileName = `${Date.now()}_${safeFileName}`;
        const filePath = window.GITHUB_CONFIG.FOLDER ? `${window.GITHUB_CONFIG.FOLDER}/${fileName}` : fileName;

        const reader = new FileReader();
        reader.onloadend = async function() {
            const base64Content = reader.result.split(',')[1];
            const url = `https://api.github.com/repos/${window.GITHUB_CONFIG.OWNER}/${window.GITHUB_CONFIG.REPO}/contents/${filePath}`;
            try {
                const response = await fetch(url, { method: 'PUT', headers: { 'Authorization': `token ${window.GITHUB_CONFIG.TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Auto upload image: ${fileName}`, content: base64Content, branch: window.GITHUB_CONFIG.BRANCH }) });
                if (response.ok) resolve(`https://raw.githubusercontent.com/${window.GITHUB_CONFIG.OWNER}/${window.GITHUB_CONFIG.REPO}/${window.GITHUB_CONFIG.BRANCH}/${filePath}`);
                else { const errorData = await response.json(); reject(`Lỗi GitHub API: ${errorData.message}`); }
            } catch (error) { reject(`Lỗi kết nối mạng: ${error.message}`); }
        };
        reader.readAsDataURL(file);
    });
};

window.handleSimpleUpload = async (element, targetInputId) => {
    let file = element.files[0]; if(!file) return; Swal.showLoading();
    try { let url = await window.uploadImageToGitHub(file); document.getElementById(targetInputId).value = url; } 
    catch (err) { Swal.showValidationMessage(err); } finally { Swal.hideLoading(); }
};