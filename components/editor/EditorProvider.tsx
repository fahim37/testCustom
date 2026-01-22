"use client";

import { createContext, useContext, useState, PropsWithChildren } from "react";

interface EditorState {
    name: string;
    setName: (name: string) => void;
    number: string;
    setNumber: (number: string) => void;
    size: string;
    setSize: (size: string) => void;
    color: string;
    setColor: (color: string) => void;
    fontFamily: string;
    setFontFamily: (font: string) => void;
    numberFontFamily: string;
    setNumberFontFamily: (font: string) => void;
    baseImage: string | null;
    baseImageName: string | null;
    baseImageType: "ai" | "raster" | null;
    baseImageSize: { width: number; height: number } | null;
    setBaseImage: (url: string | null) => void;
    setBaseImageName: (name: string | null) => void;
    setBaseImageType: (type: "ai" | "raster" | null) => void;
    setBaseImageSize: (size: { width: number; height: number } | null) => void;
    nameOffsetY: number;
    setNameOffsetY: (value: number) => void;
    numberOffsetY: number;
    setNumberOffsetY: (value: number) => void;
    shouldExport: number;
    triggerExport: () => void;
    shouldExportAi: number;
    triggerExportAi: () => void;
}

const EditorContext = createContext<EditorState | undefined>(undefined);

export function EditorProvider({ children }: PropsWithChildren) {
    const [name, setName] = useState("NEWDSADA");
    const [number, setNumber] = useState("00");
    const [size, setSize] = useState("L");
    const [color, setColor] = useState("#ffffff");
    const [fontFamily, setFontFamily] = useState("arial");
    const [numberFontFamily, setNumberFontFamily] = useState("impact");
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [baseImageName, setBaseImageName] = useState<string | null>(null);
    const [baseImageType, setBaseImageType] = useState<"ai" | "raster" | null>(null);
    const [baseImageSize, setBaseImageSize] = useState<{ width: number; height: number } | null>(null);
    const [nameOffsetY, setNameOffsetY] = useState(-20);
    const [numberOffsetY, setNumberOffsetY] = useState(40);
    const [shouldExport, setShouldExport] = useState(0);
    const [shouldExportAi, setShouldExportAi] = useState(0);

    const triggerExport = () => setShouldExport(Date.now());
    const triggerExportAi = () => setShouldExportAi(Date.now());

    const value = {
        name,
        setName,
        number,
        setNumber,
        size,
        setSize,
        color,
        setColor,
        fontFamily,
        setFontFamily,
        numberFontFamily,
        setNumberFontFamily,
        baseImage,
        setBaseImage,
        baseImageName,
        setBaseImageName,
        baseImageType,
        setBaseImageType,
        baseImageSize,
        setBaseImageSize,
        nameOffsetY,
        setNameOffsetY,
        numberOffsetY,
        setNumberOffsetY,
        shouldExport,
        triggerExport,
        shouldExportAi,
        triggerExportAi
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
}
