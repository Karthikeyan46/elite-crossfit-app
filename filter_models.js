import fs from 'fs';
const data = JSON.parse(fs.readFileSync('models_debug.json', 'utf8'));
data.models.forEach(m => {
    if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(m.name);
    }
});
