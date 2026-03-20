import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const apiKey = "AIzaSyAU6Vv-I-Tfuu9nt_KKc03OoRZXbqxaaS4";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await result.json();
        console.log("Saving model data to models_debug.json...");
        fs.writeFileSync('models_debug.json', JSON.stringify(data, null, 2));
        console.log("Done.");
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
