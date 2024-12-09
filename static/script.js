const textGenForm = document.querySelector('.text-gen-form');
let embeddingsList = [];

const embedText = async (text) => {
    const inferResponse = await fetch(`embeddings?input=${text}`);
    const inferJson = await inferResponse.json();

    return inferJson.embeddings;
};

textGenForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textGenInput = document.getElementById('text-gen-input');
    const textGenParagraph = document.querySelector('.text-gen-output');

    try {
        const embeddings = await embedText(textGenInput.value);
        embeddingsList = embeddings; // Store embeddings in the variable
        textGenParagraph.textContent = JSON.stringify(embeddingsList);
        updateDownloadButtonState(); // Update button state
    } catch (err) {
        console.error(err);
    }
});

const downloadButton = document.getElementById('download-embeddings');
const uploadButton = document.getElementById('upload-embeddings');
const fileInput = document.getElementById('file-input');

const updateDownloadButtonState = () => {
    downloadButton.disabled = embeddingsList.length === 0;
};

const downloadEmbeddings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(embeddingsList));
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
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const embeddings = JSON.parse(e.target.result);
                embeddingsList = embeddings; // Store uploaded embeddings in the variable
                updateDownloadButtonState(); // Update button state
                // Optionally, you can send the embeddings to the server
                await fetch('/receive-embeddings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ embeddings: embeddingsList })
                });
            } catch (err) {
                console.error('Error reading or parsing the file', err);
            }
        };
        reader.readAsText(file);
    }
});

downloadButton.addEventListener('click', downloadEmbeddings);
uploadButton.addEventListener('click', uploadEmbeddings);

// Initialize button state
updateDownloadButtonState();