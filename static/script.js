const textGenForm = document.querySelector('.text-gen-form');

const embedText = async (text) => {
    const inferResponse = await fetch(`embeddings?input=${text}`);
    const inferJson = await inferResponse.json();

    return inferJson.output;
};

textGenForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textGenInput = document.getElementById('text-gen-input');
    const textGenParagraph = document.querySelector('.text-gen-output');

    try {
        textGenParagraph.textContent = await embedText(textGenInput.value);
    } catch (err) {
        console.error(err);
    }
});