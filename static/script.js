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

downloadButton.addEventListener('click', downloadEmbeddings);

// Initialize button state
updateDownloadButtonState();