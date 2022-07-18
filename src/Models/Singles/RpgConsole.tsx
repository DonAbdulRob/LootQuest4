/**
 * This class manages the data that is primarily displayed in the Console window.
 * We call it 'RpgConsole' and not 'Console' because of the conflict with the reserved javascript keyword 'console'.
 */
import React from 'react';
import { Line, getFormattedTime } from '../../WIndowContent/Console/ConsoleComponent';

export class RpgConsole {
    static MAX_LINES = 50;
    lines: Array<Line> = [];
    count: number = 1;

    add(x: string): void {
        let d: Date = new Date();
        let s: string =
            getFormattedTime(d.getHours()) +
            ':' +
            getFormattedTime(d.getMinutes()) +
            ':' +
            getFormattedTime(d.getSeconds());

        this.lines.push({ text: x, time: s });

        if (this.lines.length > RpgConsole.MAX_LINES) {
            this.lines.splice(0, 1);
        }
    }

    /**
     * @param itemName The name of the item that the player fails to pick up.
     */
    addItemFail(itemName: string) {
        this.add('You fail to carry the ' + itemName + '.');
    }

    clear(): void {
        this.lines = [];
    }

    get(): Array<JSX.Element> {
        return this.lines.map((v, i) => {
            return (
                <div key={i}>
                    <p className="consoleLine">
                        {v.time}: {v.text}
                    </p>
                </div>
            );
        });
    }
}
