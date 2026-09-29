"use client";

import { useState } from "react";

export function ClaimDashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [docId, setDocId] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);

    // Chat State
    const [chatQuestion, setChatQuestion] = useState("");
    const [chatResponse, setChatResponse] = useState<any>(null);
    const [isChatting, setIsChatting] = useState(false);

    // Estimate State
    const [procedure, setProcedure] = useState("Cataract Surgery");
    const [cityTier, setCityTier] = useState(1);
    const [estimateResponse, setEstimateResponse] = useState<any>(null);
    const [isEstimating, setIsEstimating] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setDocId(data.document_id);
            setProfile(data.policy_profile);
        } catch (err) {
            console.error(err);
        }
        setIsUploading(false);
    };

    const handleChat = async () => {
        if (!docId || !chatQuestion) return;
        setIsChatting(true);
        try {
            const res = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ document_id: docId, question: chatQuestion }),
            });
            const data = await res.json();
            setChatResponse(data);
        } catch (err) {
            console.error(err);
        }
        setIsChatting(false);
    };

    const handleEstimate = async () => {
        if (!docId) return;
        setIsEstimating(true);
        try {
            const res = await fetch("http://localhost:8000/api/estimate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ document_id: docId, procedure, city_tier: cityTier, pre_existing: false, months_on_policy: 12 }),
            });
            const data = await res.json();
            setEstimateResponse(data);
        } catch (err) {
            console.error(err);
        }
        setIsEstimating(false);
    };

    return (
        <div className="w-full bg-background/50 border border-foreground/10 rounded-2xl p-6 lg:p-10 backdrop-blur shadow-2xl">
            {!docId ? (
                <div className="relative group flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-24 px-6 border-2 border-dashed border-foreground/20 rounded-3xl bg-foreground/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-500 overflow-hidden">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".pdf"
                    />

                    <div className={`w-20 h-20 rounded-full bg-background border border-foreground/10 flex items-center justify-center mb-8 transition-all duration-500 shadow-xl ${file ? 'scale-110 border-primary/50' : 'group-hover:scale-110 group-hover:border-foreground/30'}`}>
                        <svg
                            className={`w-8 h-8 transition-colors duration-500 ${file ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/70'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    <h3 className={`text-2xl font-display mb-3 transition-colors duration-300 ${file ? 'text-primary' : 'text-foreground'}`}>
                        {file ? file.name : "Select or drop policy PDF"}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm text-center mb-10 leading-relaxed relative z-20">
                        {file ? (
                            "Document successfully mounted. Click analyze to trigger the Llama-3 extraction pipeline."
                        ) : (
                            "Upload a comprehensive medical insurance document to instantly extract coverage constraints."
                        )}
                    </p>

                    <button
                        onClick={(e) => {
                            if (file) {
                                handleUpload();
                            }
                        }}
                        disabled={!file || isUploading}
                        className={`relative z-20 px-10 py-4 rounded-full font-medium tracking-wide transition-all duration-300 shadow-lg ${file && !isUploading
                            ? 'bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90 hover:shadow-primary/25'
                            : 'bg-foreground/10 text-foreground/40 pointer-events-none'
                            }`}
                    >
                        {isUploading ? "Extracting Structured Vectors..." : "Analyze Document"}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Policy Profile Panel */}
                    <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10">
                        <h3 className="font-display text-2xl mb-4">Extracted Profile</h3>
                        <div className="space-y-3 text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                            <p><span className="text-foreground">Type:</span> {profile?.policy_type || "Standard"}</p>
                            <p><span className="text-foreground">Network:</span> {profile?.network_tier || "N/A"}</p>
                            <p><span className="text-foreground">Cashless Enabled:</span> {profile?.cashless_facility ? "Yes" : "No"}</p>
                            <div className="h-px w-full bg-foreground/10 my-2" />
                            <p><span className="text-foreground">Sum Insured:</span> ${profile?.sum_insured || "N/A"}</p>
                            <p><span className="text-foreground">Deductible:</span> ${profile?.deductible || "0"}</p>
                            <p><span className="text-foreground">Copay:</span> {profile?.copayment_terms || "0%"}</p>
                            <p><span className="text-foreground">Bonus:</span> {profile?.no_claim_bonus || "None"}</p>
                            <div className="h-px w-full bg-foreground/10 my-2" />
                            <p><span className="text-foreground">Pre/Post Coverage:</span> {profile?.pre_and_post_coverage || "N/A"}</p>
                            <p><span className="text-foreground">Exclusions:</span> {profile?.exclusions?.join(", ") || "None"}</p>
                        </div>
                        <button onClick={() => setDocId(null)} className="mt-8 text-xs underline text-muted-foreground hover:text-foreground">Reset & Upload New</button>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* Cost Estimator Panel */}
                        <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10">
                            <h3 className="font-display text-2xl mb-4">Cost Estimator</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <input
                                    value={procedure}
                                    onChange={e => setProcedure(e.target.value)}
                                    className="bg-background border border-foreground/10 px-4 py-2 rounded-lg text-sm w-48"
                                    placeholder="Procedure Name"
                                />
                                <button
                                    onClick={handleEstimate}
                                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    {isEstimating ? "Calculating..." : "Run Estimate"}
                                </button>
                            </div>

                            {estimateResponse && (
                                <div className="p-4 bg-background border border-foreground/10 rounded-lg">
                                    <div className="flex gap-8 mb-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Your Total Cost</p>
                                            <p className="text-3xl font-display text-primary">${estimateResponse.out_of_pocket}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Insurance Covers</p>
                                            <p className="text-3xl font-display text-primary">${estimateResponse.covered_amount}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground space-y-1">
                                        {estimateResponse.reasoning.map((r: string, i: number) => (
                                            <p key={i}>&gt; {r}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Q&A Chat Panel */}
                        <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10">
                            <h3 className="font-display text-2xl mb-4">AI Chat Assistant</h3>
                            <textarea
                                value={chatQuestion}
                                onChange={e => setChatQuestion(e.target.value)}
                                className="w-full bg-background border border-foreground/10 rounded-lg p-3 text-sm h-20 mb-4"
                                placeholder="Ask any question about your policy..."
                            />
                            <button
                                onClick={handleChat}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                                {isChatting ? "Searching Policy..." : "Ask Question"}
                            </button>

                            {chatResponse && (
                                <div className="mt-6 p-4 bg-background border border-primary/20 rounded-lg">
                                    <p className="text-sm leading-relaxed">{chatResponse.answer}</p>
                                    <p className="text-xs text-primary mt-3 font-mono">
                                        Citation: {chatResponse.citation || "General Knowledge"} | Confidence: {chatResponse.confidence}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
