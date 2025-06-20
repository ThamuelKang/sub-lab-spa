const form = document.getElementById('form');
const result = document.getElementById('result');
const searchBar = document.getElementById('search-bar');

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    result.innerHTML = "";

    const word = searchBar.value.trim();
    if (!word) return;

    const endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        console.log(data)

        if (!response.ok) {
            result.classList.add('error');
            result.classList.remove('hidden');
            result.innerHTML = `
                <h2>${word}</h2>
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <p class="meta-details">${data.resolution}</p>
            `;
        } else {
            result.classList.remove('error');
            result.classList.remove('hidden');
        }

        // DocumentFragment to store everything
        const fragment = document.createDocumentFragment();

        // Word Title
        const searchedWord = document.createElement('h2');
        searchedWord.textContent = data[0].word;
        fragment.appendChild(searchedWord);

        // Phonetics
        const phoneticContainer = document.createElement('div');
        phoneticContainer.classList.add('phonetic-container');

        for (let i = 0; i < data[0].phonetics.length; i++) {
            const wordPronunciation = document.createElement('h3');
            wordPronunciation.textContent = data[0].phonetics[i].text || '';
            phoneticContainer.appendChild(wordPronunciation)
            fragment.appendChild(phoneticContainer);
        }

        const audioEntry = data[0].phonetics.find(p => p.audio);

        if (audioEntry) {
            const audio = new Audio(audioEntry.audio);

            const playButton = document.createElement('button');
            playButton.textContent = "🔊 Play Pronunciation";
            playButton.addEventListener('click', () => {
                audio.play();
            });
            fragment.appendChild(playButton)
        }


        // Definitions
        const meanings = data[0].meanings;

        for (let i = 0; i < meanings.length; i++) {
            const meaning = meanings[i];

            const container = document.createElement('div');
            container.classList.add('details');

            const partOfSpeech = document.createElement('p');
            partOfSpeech.classList.add('part-of-speech');
            partOfSpeech.textContent = meaning.partOfSpeech;
            container.appendChild(partOfSpeech);

            if (meaning.synonyms.length) {
                const synonyms = document.createElement('p');
                synonyms.classList.add('meta-details');
                synonyms.textContent = `Synonyms: ${meaning.synonyms.join(", ")}`;
                container.appendChild(synonyms);
            }

            if (meaning.antonyms.length) {
                const antonyms = document.createElement('p');
                antonyms.classList.add('meta-details');
                antonyms.textContent = `Antonyms: ${meaning.antonyms.join(", ")}`;
                container.appendChild(antonyms);
            }

            const definitionList = document.createElement('ul');
            definitionList.classList.add('definition-container');

            for (let j = 0; j < meaning.definitions.length; j++) {
                const li = document.createElement('li');
                li.textContent = meaning.definitions[j].definition;
                definitionList.appendChild(li);
            }

            container.appendChild(definitionList);
            fragment.appendChild(container);
        }

        // Append to container
        result.appendChild(fragment);

    } catch (error) {
        result.classList.add('error');
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Error: ${error.message}`;
        result.appendChild(errorMessage);
        console.error("Error fetching the data:", error);
    }
});
