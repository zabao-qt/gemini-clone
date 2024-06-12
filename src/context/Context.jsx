import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

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
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;