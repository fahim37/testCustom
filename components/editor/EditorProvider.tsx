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
    setBaseImage: (url: string | null) => void;
    shouldExport: number;
    triggerExport: () => void;
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
    const [shouldExport, setShouldExport] = useState(0);

    const triggerExport = () => setShouldExport(Date.now());

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
        shouldExport,
        triggerExport
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
