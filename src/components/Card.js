import React, { useState, useEffect } from 'react'
import "./Card.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

const Card = ({ front, back, cardOrientation }) => {
    const [frontText, setFrontText] = useState("");
    const [backText, setBackText] = useState("");
    const [flip, setFlip] = useState(true);

    useEffect(() => {
        setFlip(cardOrientation);
        setFrontText(front);
        setBackText(back);
        console.log("detected change");
    }, [front, back, cardOrientation]);


    return (
        <>
            <div className={flip ? "maincontainerflipped" : "maincontainer"}>
                <div className="card" id="card">
                    <div className="front" >
                        <ReactMarkdown className="frontRender" children={frontText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeKatex, remarkMath, [rehypeHighlight, { ignoreMissing: true }]]} />
                    </div>
                    <div className="back">
                        <ReactMarkdown children={backText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeKatex, remarkMath, [rehypeHighlight, { ignoreMissing: true }]]} />
                    </div>
                </div>
            </div>
            <label htmlFor="card" id="previewlabel">{flip ? "DEFINITION PREVIEW" : "TERM PREVIEW"}</label>
        </>
    )
}

export default Card
