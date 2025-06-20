
const form = document.getElementById('form')
const result = document.getElementById('result')

let endpoint = 'https://api.dictionaryapi.dev/api/v2/entries/en/hello'

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data)

        const searchedWord = document.createElement('h2')
        searchedWord.textContent = data[0].word
        result.appendChild(searchedWord)

        const multipleDefinition = data[0].meanings

        for (i = 0; i < multipleDefinition.length; i++) {
            const container = document.createElement('div')
            container.classList.add('definition')
            result.appendChild(container)

            const partOfSpeech = document.createElement('p')
            partOfSpeech.classList.add('part-of-speech')
            partOfSpeech.textContent = multipleDefinition[i].partOfSpeech
            container.appendChild(partOfSpeech)

            const synonyms = document.createElement('p')
            synonyms.textContent = `synonyms: ${multipleDefinition[i].synonyms}`
            container.appendChild(synonyms)

            const antonyms = document.createElement('p')
            antonyms.textContent = `antonyms: ${multipleDefinition[i].antonyms}`
            container.appendChild(antonyms)

            for (j = 0; j < multipleDefinition[i].definitions.length; j++) {
                const newDefinition = document.createElement('p')
                newDefinition.textContent = multipleDefinition[i].definitions[j].definition
                container.appendChild(newDefinition)
            }


        }
    } catch (error) {
        console.error("Error fetching the data:", error);
    }
});