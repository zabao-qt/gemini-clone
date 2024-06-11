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

    }

    const onSent = async (prompt) => {
        setResultData('') // Remove the previous result
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        const response = await run(input) // Call the Gemini API here
        let responseArray = response.split("**")
        let newResponse = '';
        for (let i = 0; i < responseArray.length; i++) {
            if (i == 0 || i % 2 == 0) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("<br>")
        // let codeArray = newResponse2.split("`")
        // let finalResponse = '';
        // for (let i = 0; i < codeArray.length; i++) {
        //     if (i == 0 || i % 2 == 0) {
        //         finalResponse += codeArray[i];
        //     } else {
        //         finalResponse += "<code>" + codeArray[i] + "</code>";
        //     }
        // }

        // let finalResponse2 = finalResponse.split("```").join("</pre>");
        setResultData(newResponse2)
        console.log(newResponse2)
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
        setInput
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;