"use client";

import { useEditor } from "./EditorProvider";
import { motion } from "framer-motion";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";

export function JerseyCanvas() {
    const {
        name,
        number,
        color,
        fontFamily,
        numberFontFamily,
        baseImage,
        baseImageSize,
        nameOffsetY,
        numberOffsetY,
        shouldExport,
        shouldExportAi
    } = useEditor();
    const canvasRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);
    const numberRef = useRef<HTMLHeadingElement>(null);

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
    };

    const { jerseyWidth, jerseyHeight } = useMemo(() => {
        const maxWidth = 420;
        const maxHeight = 520;
        const aspect = baseImageSize ? baseImageSize.width / baseImageSize.height : 400 / 480;
        let width = maxWidth;
        let height = width / aspect;
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspect;
        }
        return { jerseyWidth: width, jerseyHeight: height };
    }, [baseImageSize]);

    const nameFontSize = useMemo(() => {
        const scale = jerseyWidth / 400;
        return Math.max(32, 48 * scale);
    }, [jerseyWidth]);

    const numberFontSize = useMemo(() => {
        const scale = jerseyWidth / 400;
        return Math.max(96, 160 * scale);
    }, [jerseyWidth]);

    const escapeForSvg = (value: string) => {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    };

    const exportAi = async () => {
        if (!canvasRef.current) return;
        const canvasWidth = 500;
        const canvasHeight = 600;
        const jerseyX = (canvasWidth - jerseyWidth) / 2;
        const jerseyY = (canvasHeight - jerseyHeight) / 2;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const nameRect = nameRef.current?.getBoundingClientRect();
        const numberRect = numberRef.current?.getBoundingClientRect();

        const toLocal = (rect?: DOMRect) => {
            if (!rect) return null;
            return {
                x: rect.left - canvasRect.left,
                y: rect.top - canvasRect.top,
                width: rect.width,
                height: rect.height,
            };
        };

        const nameBox = toLocal(nameRect);
        const numberBox = toLocal(numberRect);

        const nameY = nameBox ? nameBox.y + nameBox.height * 0.85 : canvasHeight / 2;
        const numberY = numberBox ? numberBox.y + numberBox.height * 0.9 : canvasHeight / 2;

        const fontForSvg = (font: string) => getFontFamily(font).split(",")[0];

        const gradientSvg = `
            <defs>
                <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366F1" />
                    <stop offset="100%" stop-color="#2563EB" />
                </linearGradient>
            </defs>
            <rect x="${jerseyX}" y="${jerseyY}" width="${jerseyWidth}" height="${jerseyHeight}" rx="28" fill="url(#bg-grad)" />
        `;

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
                <rect width="100%" height="100%" fill="#ffffff" />
                ${baseImage
                ? `<image href="${baseImage}" x="${jerseyX}" y="${jerseyY}" width="${jerseyWidth}" height="${jerseyHeight}" preserveAspectRatio="xMidYMid meet" />`
                : gradientSvg
            }
                <text x="${canvasWidth / 2}" y="${nameY}" text-anchor="middle" font-family="${fontForSvg(fontFamily)}" font-size="${nameFontSize}" font-weight="700" fill="${color}">${escapeForSvg(name)}</text>
                <text x="${canvasWidth / 2}" y="${numberY}" text-anchor="middle" font-family="${fontForSvg(numberFontFamily)}" font-size="${numberFontSize}" font-weight="800" fill="${color}">${escapeForSvg(number)}</text>
            </svg>
        `;

        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `jersey-${name}-${number}.ai`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (shouldExportAi) {
            exportAi();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldExportAi]);

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
                    className="relative w-[500px] h-[600px] rounded-3xl flex items-center justify-center overflow-hidden"
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                >
                    {/* Base Jersey Layer */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
                    >
                        <div
                            className="relative rounded-[36px] overflow-hidden"
                            style={{
                                width: `${jerseyWidth}px`,
                                height: `${jerseyHeight}px`,
                                backgroundImage: "linear-gradient(135deg, #6366f1 0%, #2563eb 100%)",
                                border: "1px solid rgba(255,255,255,0.4)",
                                boxShadow: "0 20px 35px rgba(0,0,0,0.25)"
                            }}
                        >
                            {baseImage ? (
                                <img
                                    src={baseImage}
                                    alt="Uploaded jersey"
                                    className="absolute inset-0 h-full w-full object-contain"
                                    style={{ backgroundColor: "#ffffff" }}
                                />
                            ) : (
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)"
                                    }}
                                />
                            )}

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <motion.h2
                                    className="font-bold uppercase tracking-wide text-center"
                                    ref={nameRef}
                                    style={{
                                        color: color,
                                        fontFamily: getFontFamily(fontFamily),
                                        fontSize: `${nameFontSize}px`,
                                        transform: `translateY(${nameOffsetY}px)`,
                                        lineHeight: 1,
                                        textShadow: "0 2px 8px rgba(0,0,0,0.25)"
                                    }}
                                >
                                    {name}
                                </motion.h2>

                                <motion.h1
                                    className="font-bold leading-none text-center"
                                    ref={numberRef}
                                    style={{
                                        color: color,
                                        fontFamily: getFontFamily(numberFontFamily),
                                        fontSize: `${numberFontSize}px`,
                                        transform: `translateY(${numberOffsetY}px)`,
                                        lineHeight: 0.9,
                                        textShadow: "0 4px 12px rgba(0,0,0,0.25)"
                                    }}
                                >
                                    {number}
                                </motion.h1>
                            </div>
                        </div>
                    </div>

                    {/* Reflection / Texture Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)"
                        }}
                    ></div>
                </motion.div>
            </div>

            {/* Floating info for user */}
            <div className="absolute bottom-4 left-4 text-[10px] text-muted-foreground">
                Canvas: 3000px x 4000px @ 300dpi
            </div>
        </main>
    );
}
