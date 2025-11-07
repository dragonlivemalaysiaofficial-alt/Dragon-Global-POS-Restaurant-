import React, { useState, useRef, useEffect } from 'react';
import { Order } from '../types';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../contexts/ToastContext';
import { LightBulbIcon, UserIcon } from './icons';

interface AIAnalystProps {
    orders: Order[];
}

interface ConversationTurn {
    role: 'user' | 'model';
    text: string;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ orders }) => {
    const [conversation, setConversation] = useState<ConversationTurn[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const { showToast } = useToast();
    const conversationEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const renderMarkdown = (text: string) => {
        // A very simple markdown-to-HTML converter
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italics
            .replace(/`([^`]+)`/g, '<code>$1</code>')     // Inline code
            .replace(/^(#+)\s*(.*)/gm, (match, hashes, content) => { // Headers
                const level = hashes.length;
                return `<h${level}>${content}</h${level}>`;
            })
            .replace(/^\* (.*)/gm, '<ul><li>$1</li></ul>') // Unordered list
            .replace(/<\/ul>\n<ul>/g, ''); // Combine adjacent list items

        return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br />') }} />;
    };

    const handleSubmitQuery = async (currentQuery: string) => {
        if (!currentQuery.trim() || isLoading) return;

        setIsLoading(true);
        setConversation(prev => [...prev, { role: 'user', text: currentQuery }]);
        setQuery('');

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Summarize data to keep the prompt concise and focused
            const ordersSummary = orders.map(o => ({
                date: o.date,
                total: o.total,
                itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
                items: o.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
                paymentMethod: o.paymentMethod,
                orderType: o.orderType,
                waiterName: o.waiterName,
            }));

            const prompt = `
                You are a helpful sales data analyst for a restaurant called Dragon Global.
                Your task is to analyze the provided sales data and answer the user's question.
                The data is an array of order objects in JSON format. Each object represents a completed order.
                Today's date is ${new Date().toLocaleDateString()}.

                Here is the sales data:
                ${JSON.stringify(ordersSummary)}

                Based ONLY on the data provided, please answer the following question: "${currentQuery}"

                Provide your answer in a clear, friendly, and concise manner. Format your response using Markdown for lists, bold text, and headers to make the output easy to read. Do not output JSON or code blocks. If the data is insufficient to answer the question, please state that clearly.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setConversation(prev => [...prev, { role: 'model', text: response.text }]);

        } catch (error) {
            console.error("Error with AI Analyst:", error);
            const errorMessage = "Sorry, I couldn't process that request. Please check your API key or try again later.";
            setConversation(prev => [...prev, { role: 'model', text: errorMessage }]);
            showToast("An error occurred while communicating with the AI.", 'info');
        } finally {
            setIsLoading(false);
        }
    };
    
    const suggestionChips = [
        "What are my top 5 best-selling items by quantity?",
        "What were the total sales yesterday?",
        "Which waiter has the highest total sales?",
        "Compare cash vs. card payments.",
    ];

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)] bg-secondary rounded-lg shadow-lg">
            <div className="p-4 border-b border-secondary-light text-center">
                <h1 className="text-2xl font-bold font-serif">AI Sales Analyst</h1>
                <p className="text-sm text-text-secondary">Ask questions about your sales data.</p>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {conversation.length === 0 && (
                    <div className="text-center text-text-secondary pt-10">
                        <LightBulbIcon className="w-16 h-16 mx-auto text-accent/50 mb-4"/>
                        <p>No questions asked yet. Try one of the suggestions below!</p>
                    </div>
                )}
                {conversation.map((turn, index) => (
                    <div key={index} className={`flex items-start gap-3 ${turn.role === 'user' ? 'justify-end' : ''}`}>
                        {turn.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <LightBulbIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-xl p-3 rounded-lg ${turn.role === 'user' ? 'bg-primary text-white' : 'bg-secondary-light'}`}>
                            {turn.role === 'user' ? <p>{turn.text}</p> : renderMarkdown(turn.text)}
                        </div>
                         {turn.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-secondary-light flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-5 h-5 text-text-primary" />
                            </div>
                        )}
                    </div>
                ))}
                 {isLoading && (
                     <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                             <LightBulbIcon className="w-5 h-5 text-white animate-pulse" />
                         </div>
                         <div className="max-w-xl p-3 rounded-lg bg-secondary-light">
                             <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                                 <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-150"></div>
                                 <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-300"></div>
                             </div>
                         </div>
                     </div>
                 )}
                <div ref={conversationEndRef} />
            </div>

            <div className="p-4 border-t border-secondary-light">
                 <div className="mb-3 flex flex-wrap gap-2">
                    {suggestionChips.map(chip => (
                        <button 
                            key={chip}
                            onClick={() => handleSubmitQuery(chip)}
                            disabled={isLoading}
                            className="px-3 py-1 bg-secondary-light hover:bg-primary/80 rounded-full text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {chip}
                        </button>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuery(query); }}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., How much did we make this week?"
                            disabled={isLoading}
                            className="flex-grow bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !query.trim()}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Thinking...' : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AIAnalyst;