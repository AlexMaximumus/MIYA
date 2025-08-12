
'use client';

import { useState, useEffect } from 'react';
import * as wanakana from 'wanakana';

interface FuriganaProps {
  text: string;
  className?: string;
}

/**
 * A component that automatically adds furigana (<ruby> tags) to Japanese text.
 * It uses the wanakana library to parse the text and generate the appropriate HTML.
 * The component is rendered on the client-side to ensure wanakana has access to the necessary APIs.
 *
 * @param {string} text - The Japanese text to be rendered with furigana.
 * @param {string} [className] - Optional CSS classes to apply to the container.
 */
export default function Furigana({ text, className }: FuriganaProps) {
    // We use state and an effect to ensure that the HTML generation happens on the client,
    // preventing potential hydration mismatches with server-rendered content.
    const [rubyHtml, setRubyHtml] = useState('');

    useEffect(() => {
        setRubyHtml(wanakana.toRuby(text));
    }, [text]);

    if (!rubyHtml) {
        // Render the plain text initially or while the effect is running.
        return <span className={className}>{text}</span>;
    }
    
    // Using dangerouslySetInnerHTML to render the HTML string from wanakana.
    // This is safe because the input is controlled and processed by a trusted library.
    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: rubyHtml }}
        />
    );
}
