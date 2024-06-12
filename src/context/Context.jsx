import { createContext, useEffect, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    
    const compassPrompts = [
        "Suggest beautiful places to see on an upcoming road trip",
        "Help me get organized with a list of 10 tips",
        "Create a few tips on how I can grow my YouTube Channel",
        "Help me compare these college majors",
        "Create a travel itinerary for a city"
    ];

    const bulbPrompts = [
        "Briefly summarize this concept: CI/CD",
        "Act like Mowgli from The Jungle Book and answer questions",
        "What are tips to improve public speaking skills",
        "Road trip drive time and kid entertainment ideas",
        "Outline an organized & logical sales pitch for a new product",
        "I’m sick and need help crafting a text message for my boss"
    ];

    const codePrompts = [
        "Improve the readability of the following code",
        "Look up a Linux shell command for a specific task",
        "Write code for a specific task, including edge cases",
        "Suggest a Python library to solve a problem"
    ];

    const messagePrompts = [
        "Brainstorm team bonding activities for our work retreat",
        "Provide questions to help me prepare for an interview",
        "Come up with a complex word riddle, including hints"
    ];

    const [randomizedPrompts, setRandomizedPrompts] = useState({
        compass: "",
        bulb: "",
        code: "",
        message: ""
    });

    
    const randomizePrompts = () => {
        const getRandomPrompt = (prompts) => prompts[Math.floor(Math.random() * prompts.length)];
        
        setRandomizedPrompts({
            compass: getRandomPrompt(compassPrompts),
            bulb: getRandomPrompt(bulbPrompts),
            code: getRandomPrompt(codePrompts),
            message: getRandomPrompt(messagePrompts)
        });
    };

    useEffect(() => {
        randomizePrompts();
    }, []);



    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        }, 20*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const parseMarkdown = (text) => {
        // Handle block code (``` ... ```)
        text = text.replace(/```([\s\S]*?)```/g, (match, p1) => {
            const code = p1.trim();
            return `<pre><code>${code}</code></pre>`;
        });

        // Handle inline code (` ... `)
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Handle headers (##)
        text = text.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>$2');

        // Handle bold text (** ... **)
        text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        // Handle lists (* item)
        text = text.replace(/^\* (.*?)(\n|$)/gm, '<li>$1</li>');

        // Wrap <li> elements with <ul>
        text = text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

        // Handle line breaks (\n)
        text = text.replace(/\n/g, '<br>');

        return text;
    };

    const onSent = async (prompt) => {
        setResultData('') // Remove the previous result
        setLoading(true)
        setShowResult(true)

        let response;
        if (prompt !== undefined) {
            response = await run(prompt); // Call the Gemini API
            setRecentPrompt(prompt)
        } else {
            setPrevPrompts(prev=>[...prev, input])
            setRecentPrompt(input)
            response = await run(input); // Call the Gemini API
        }

        // let responseArray = response.split("**")
        // let newResponse = '';
        // for (let i = 0; i < responseArray.length; i++) {
        //     if (i == 0 || i % 2 == 0) {
        //         newResponse += responseArray[i];
        //     } else {
        //         newResponse += "<b>" + responseArray[i] + "</b>";
        //     }
        // }
        // let newResponse2 = newResponse.split("*").join("<br>")
        let newResponse2 = parseMarkdown(response)
        
        // Typing effect
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }
        console.log(newResponse2) // For debugging
        setLoading(false)
        setInput('')
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        randomizedPrompts,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;