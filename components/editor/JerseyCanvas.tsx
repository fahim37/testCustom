"use client";

import { useEditor } from "./EditorProvider";
import { motion } from "framer-motion";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export function JerseyCanvas() {
    const { name, number, color, fontFamily, numberFontFamily, baseImage, shouldExport } = useEditor();
    const canvasRef = useRef<HTMLDivElement>(null);

    // Export Logic
    useEffect(() => {
        if (shouldExport && canvasRef.current) {
            html2canvas(canvasRef.current, {
                useCORS: true,
                scale: 2, // High resolution
            } as any).then((canvas) => {
                const link = document.createElement('a');
                link.download = `jersey-${name}-${number}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        }
    }, [shouldExport, name, number]);

    // Font mapping
    const getFontFamily = (font: string) => {
        switch (font) {
            case 'arial': return 'Arial, sans-serif';
            case 'inter': return 'Inter, sans-serif';
            case 'oswald': return 'Oswald, sans-serif';
            case 'impact': return 'Impact, sans-serif';
            case 'college': return 'Block, sans-serif';
            default: return 'Arial, sans-serif';
        }
    }

    return (
        <main className="flex-1 relative bg-zinc-50 dark:bg-zinc-950/50 flex items-center justify-center overflow-hidden">
            {/* Canvas Toolbar */}
            <div className="absolute top-4 flex gap-2 z-10 bg-white/50 backdrop-blur rounded-full p-1 shadow-sm border dark:bg-black/50 dark:border-white/10">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border my-auto" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Maximize2 className="h-3 w-3" />
                </Button>
            </div>

            {/* The Canvas Area */}
            {/* Container for centering */}
            <div className="relative flex items-center justify-center">
                <motion.div
                    ref={canvasRef}
                    layout
                    className="relative w-[500px] h-[600px] bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                >
                    {/* Base Jersey Layer */}
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">

                        {/* Visual Placeholder for Jersey */}
                        <div className="w-[400px] h-[480px] bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[40px] shadow-lg relative mask-jersey flex items-center justify-center">
                            {/* Collar */}
                            <div className="absolute top-0 w-32 h-10 bg-black/20 rounded-b-full"></div>

                            {/* Content Overlay */}
                            <div className="relative z-10 flex flex-col items-center justify-center gap-4 translate-y-[-20px]">
                                {/* Name */}
                                <motion.h2
                                    className="text-4xl font-bold uppercase tracking-wide drop-shadow-lg"
                                    style={{
                                        color: color,
                                        fontFamily: getFontFamily(fontFamily)
                                    }}
                                >
                                    {name}
                                </motion.h2>

                                {/* Number */}
                                <motion.h1
                                    className="text-9xl font-bold leading-none drop-shadow-xl"
                                    style={{
                                        color: color,
                                        fontFamily: getFontFamily(numberFontFamily),
                                        // WebkitTextStroke: '2px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {number}
                                </motion.h1>
                            </div>
                        </div>
                    </div>

                    {/* Reflection / Texture Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none mix-blend-overlay"></div>
                </motion.div>
            </div>

            {/* Floating info for user */}
            <div className="absolute bottom-4 left-4 text-[10px] text-muted-foreground">
                Canvas: 3000px x 4000px @ 300dpi
            </div>
        </main>
    );
}
