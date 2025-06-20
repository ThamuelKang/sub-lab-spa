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

        console.log(data);

        if (!response.ok) {
            result.classList.add('error');
            result.classList.remove('hidden');
            result.innerHTML = `
                <h2>${word}</h2>
                <h3>${data.title || "Error"}</h3>
                <p>${data.message || "Something went wrong."}</p>
                <p class="meta-details">${data.resolution || ""}</p>
            `;
            return;
        }

        result.classList.remove('error');
        result.classList.remove('hidden');

        // DocumentFragment to store everything
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < data.length; i++) {
            const entry = data[i];

            // Word Title
            const searchedWord = document.createElement('h2');
            searchedWord.textContent = entry.word;
            fragment.appendChild(searchedWord);

            // Phonetics
            const phoneticContainer = document.createElement('div');
            phoneticContainer.classList.add('phonetic-container');

            for (let j = 0; j < entry.phonetics.length; j++) {
                const wordPronunciation = document.createElement('h3');
                wordPronunciation.textContent = entry.phonetics[j].text || '';
                phoneticContainer.appendChild(wordPronunciation);
            }
            fragment.appendChild(phoneticContainer);

            const audioEntry = entry.phonetics.find(p => p.audio);

            if (audioEntry) {
                const audio = new Audio(audioEntry.audio);

                const playButton = document.createElement('button');
                playButton.textContent = "🔊 Play Pronunciation";
                playButton.addEventListener('click', () => {
                    audio.play();
                });
                fragment.appendChild(playButton);
            }

            // Source 
            const sourceLink = document.createElement('a');
            sourceLink.textContent = "View source";
            sourceLink.href = entry.sourceUrls[0]; 
            sourceLink.target = "_blank";
            sourceLink.rel = "noopener noreferrer";
            fragment.appendChild(sourceLink);


            // Meanings
            const meanings = entry.meanings;

            for (let k = 0; k < meanings.length; k++) {
                const meaning = meanings[k];

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

                for (let l = 0; l < meaning.definitions.length; l++) {
                    const li = document.createElement('li');
                    li.textContent = meaning.definitions[l].definition;
                    definitionList.appendChild(li);
                }

                container.appendChild(definitionList);
                fragment.appendChild(container);
            }
        }

        // Append everything at once
        result.appendChild(fragment);

    } catch (error) {
        result.classList.add('error');
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Error: ${error.message}`;
        result.appendChild(errorMessage);
        console.error("Error fetching the data:", error);
    }
});
