const textGenForm = document.querySelector('.text-gen-form');
let docsList = [];

const embedText = async (text) => {
    const inferResponse = await fetch(`parsing?input=${text}`);
    const inferJson = await inferResponse.json();

    return inferJson;
};

const spinnerOverlay = document.createElement('div');
spinnerOverlay.classList.add('spinner-overlay');
spinnerOverlay.innerHTML = '<div class="spinner"></div>';
document.body.appendChild(spinnerOverlay);

const showSpinner = () => {
    spinnerOverlay.style.display = 'flex';
};

const hideSpinner = () => {
    spinnerOverlay.style.display = 'none';
};

textGenForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showSpinner();

    const textGenInput = document.getElementById('text-gen-input');
    const textGenParagraph = document.querySelector('.text-gen-output');

    try {
        const embeddings = await embedText(textGenInput.value);
        docsList = embeddings; // Store embeddings in the variable
        textGenParagraph.textContent = JSON.stringify(docsList);
        updateDownloadButtonState(); // Update button state
    } catch (err) {
        console.error(err);
    } finally {
        hideSpinner();
    }
});

const downloadButton = document.getElementById('download-embeddings');

const uploadButton = document.getElementById('upload-embeddings');

const fileInput = document.getElementById('file-input');

const updateDownloadButtonState = () => {
    downloadButton.disabled = docsList.length === 0;
};

const downloadEmbeddings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(docsList));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "embeddings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

const uploadEmbeddings = () => {
    fileInput.click();
};

fileInput.addEventListener('change', async (event) => {
    showSpinner();
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const embeddings = JSON.parse(e.target.result);
                docsList = embeddings; // Store uploaded embeddings in the variable

                const textGenParagraph = document.querySelector('.text-gen-output');
                textGenParagraph.textContent = JSON.stringify(docsList);

                updateDownloadButtonState(); // Update button state
                // Optionally, you can send the embeddings to the server
                await fetch('/receive-embeddings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ embeddings: docsList })
                });
            } catch (err) {
                console.error('Error reading or parsing the file', err);
            } finally {
                hideSpinner();
            }
        };
        reader.readAsText(file);
    } else {
        hideSpinner();
    }
});

downloadButton.addEventListener('click', downloadEmbeddings);
uploadButton.addEventListener('click', uploadEmbeddings);

// Initialize button state
updateDownloadButtonState();

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');

const sendMessage = async (message) => {
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.reply;
};

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userMessage = chatInput.value;
    if (userMessage.trim() === '') return;

    const userMessageElement = document.createElement('div');
    userMessageElement.textContent = `You: ${userMessage}`;
    userMessageElement.classList.add('user-message');
    chatBox.appendChild(userMessageElement);

    chatInput.value = '';

    try {
        const reply = await sendMessage(userMessage);
        const replyMessageElement = document.createElement('div');
        replyMessageElement.textContent = `Bot: ${reply}`;
        replyMessageElement.classList.add('bot-reply');
        chatBox.appendChild(replyMessageElement);
    } catch (err) {
        console.error('Error sending message:', err);
    }
});