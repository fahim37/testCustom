import { PropsWithChildren } from "react";
import { Header } from "./Header";

export function Shell({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
