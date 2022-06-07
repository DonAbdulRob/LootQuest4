import React from "react";
import { __GLOBAL_GAME_STORE } from "../../Models/GlobalGameStore";

interface Line {
    text: string,
    time: string
}

function getFormattedTime(x: number) {
    if (x < 10) {
        return "0" + x;
    }
    return x;
}

export class ConsoleData {
    lines: Array<Line> = [];
    count: number = 1;

    add(x: string): void {
        let d: Date = new Date();
        let s: string = getFormattedTime(d.getHours()) + ":" + getFormattedTime(d.getMinutes()) + ":" + getFormattedTime(d.getSeconds());

        this.lines.push({text: x, time: s});

        if (this.lines.length > 10) {
            this.lines.splice(0, 1); 
        }
    }

    clear(): void {
        this.lines = [];
    }

    get(): Array<JSX.Element> {
        return this.lines.map((v, i) => {
            return <div key={i}>
                <p className="consoleLine">
                    [{ v.time }]: {v.text} 
                </p>
            </div>
        });
    }
}

export default function Console() {
    let consoleData = __GLOBAL_GAME_STORE((__DATA: any) => __DATA.consoleData);

    return <div>
        <h1>Console</h1>
        {consoleData.get()}
    </div>
}