const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = 'ages.json';
const README_FILE = 'README.md';

function calculateAge(birthDate) {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();

    if (hours < 0) {
        days--;
        hours += 24;
    }
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months, days, hours };
}

const EMOJIS = {
    dog: '🐶',
    cat: '🐱',
    bird: '🐦',
    frog: '🐸'
};

const IMAGES = {
    dog: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
    cat: 'https://media.giphy.com/media/OmK8lulOMQ9XO/giphy.gif',
    bird: 'https://media.giphy.com/media/1dMNq7sH2v5i/giphy.gif',
    frog: 'https://media.giphy.com/media/6brH8o6dykYtC/giphy.gif'
};

async function updateReadme() {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE));
        const categories = data.categories;

        // Calculate ages and update data
        for (const [type, pets] of Object.entries(categories)) {
            for (const pet of pets) {
                const bdate = new Date(pet.date_of_birth);
                pet.age = calculateAge(bdate);
            }
        }

        // Build image row
        let imageRow = '';
        for (const type of Object.keys(categories)) {
            if (IMAGES[type]) {
                imageRow += `<img src="${IMAGES[type]}" width="120" height="120" alt="${type}"> `;
            }
        }

        // Build pet age list
        let petList = '';
        for (const [type, pets] of Object.entries(categories)) {
            for (const pet of pets) {
                const age = pet.age;
                const emoji = EMOJIS[type] || '';
                petList += `- **${pet.name}** (${emoji}): ${age.years} years, ${age.months} months, ${age.days} days, ${age.hours} hours\n`;
            }
        }

        // Timestamp
        const timestamp = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'long',
            timeStyle: 'long'
        });

        // New README content
        const readmeContent = `## 🐾 Chronopets 𓅓

${imageRow}

> **Daily age updates for my pets: Bruno the Dog, Mochi the Cat, Kiwi & Mango the Birds!**

## 📅 Last updated: ${timestamp}

${petList}
---
✨ Auto-updated using GitHub Actions
`;

        // Write updated ages.json and README.md
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        await fs.writeFile(README_FILE, readmeContent);

        console.log('README and ages.json updated!');
    } catch (error) {
        console.error('Error:', error);
    }
}

updateReadme();
