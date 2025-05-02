const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = 'ages.json';
const README_FILE = 'README.md';

// Improved age calculation using date components
function calculateAge(birthDate) {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();

    // Adjust for negative months/days/hours
    if (months < 0) {
        years--;
        months += 12;
    }
    if (days < 0) {
        months--;
        const tempDate = new Date(now);
        tempDate.setMonth(tempDate.getMonth() - 1);
        days += new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    }
    if (hours < 0) {
        days--;
        hours += 24;
    }

    return { years, months, days, hours };
}

async function updateReadme() {
    try {
        // Load pet data
        const data = JSON.parse(await fs.readFile(DATA_FILE));
        const pets = Object.entries(data);
        
        // Calculate ages
        const ages = {};
        for (const [name, details] of pets) {
            const birthDate = new Date(details.birthday);
            ages[name] = calculateAge(birthDate);
        }

        // Generate new README content
        const timestamp = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'long',
            timeStyle: 'long'
        });

        const readmeContent = `## 🐾 Chronopets 𓅓

<img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" width="120" height="120" alt="Dog">
<img src="https://media.giphy.com/media/OmK8lulOMQ9XO/giphy.gif" width="120" height="120" alt="Cat">
<img src="https://media.giphy.com/media/1dMNq7sH2v5i/giphy.gif" width="120" height="120" alt="Bird">
<img src="https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif" width="120" height="120" alt="Bird">

> **Daily age updates for my pets: Bruno the Dog, Mochi the Cat, Kiwi & Mango the Birds!**

## 📅 Last updated: ${timestamp}

${pets.map(([name, details]) => {
    const age = ages[name];
    const emoji = details.species === 'Dog' ? '🐶' : 
                 details.species === 'Cat' ? '🐱' : '🐦';
    return `- **${name}** (${emoji}): ${age.years} years, ${age.months} months, ${age.days} days, ${age.hours} hours`;
}).join('\n')}

---

✨ Auto-updated using GitHub Actions`;

        await fs.writeFile(README_FILE, readmeContent);
        console.log('README updated successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

updateReadme();
