/**
 * The 'AreaContainer' is our game map. We don't call it 'Map' because that's a js reserved keyword.
 */

import { Player } from '../Fighter/Player/Player';
import Area from './Area';
import AreaDescriptions from './AreaDescriptions';
import EAreaType from './EAreaType';
import { TownDescription } from './TownDescription';

function getTownDescription() {
    return new TownDescription(
        'A small town located within the wilderness of the Elora Continent.',
        'The inn is a place to heal up and chat with locals.',
        'The shop is a place to buy goods',
        'The forge is a place to craft items.',
        'The guild is a place to accept quests and recuit allies. Unfortunately, it appears to be closed right now.',
    );
}

export const G_AREA_GREENVALE = new Area('Greenvale', getTownDescription(), EAreaType.TOWN, 1, 1);

export default class AreaContainer {
    globalAreaList: Area[] = [];

    constructor() {
        this.generateAreas();
    }

    hasArea(areaArg: Area, areaList: Area[]) {
        for (let area of areaList) {
            if (area.name === areaArg.name) {
                return true;
            }
        }

        return false;
    }

    getAreaList(player: Player) {
        // Array of allowed areas.
        let areaArr = [];
        let playerLevel = player.level;
        let currentArea = player.currentArea;

        // First, get any area 3 levels or lower.
        for (let area of this.globalAreaList) {
            if (playerLevel - area.levelMax >= 3) {
                areaArr.push(area);
            }
        }

        // Then, add connected areas.
        for (let area of currentArea.connectedAreas) {
            if (!this.hasArea(area, areaArr)) {
                areaArr.push(area);
            }
        }

        // Finally, return our area array!
        return areaArr;
    }

    // Connect areas to each other.
    connectAreas(area1: Area, area2: Area) {
        area1.addConnectedArea(area2);
        area2.addConnectedArea(area1);
    }

    generateAreas() {
        const greenvaleOutskirts = new Area(
            'Greenvale Outskirts',
            getTownDescription().getWithCustomRoot('The small border region between Greevale and its wild forests.'),
            EAreaType.FOREST,
            1,
            2,
        );
        const greenvaleForest = new Area(
            'Greenvale Forest',
            new AreaDescriptions('A sparse forest lush with flora and fauna.'),
            EAreaType.FOREST,
            3,
            4,
        );
        const greenvaleMine = new Area(
            'Greenvale Mine',
            new AreaDescriptions('A local & active mine near Greenvale full of stone and ores.'),
            EAreaType.MINE,
            3,
            4,
        );
        const westAstonRoad = new Area(
            'West Aston Road',
            new AreaDescriptions('A dirt-road between Greenvale and Aston that passes through deep woods.'),
            EAreaType.FOREST,
            5,
            6,
        );
        const astonRoadDeepWoods = new Area(
            'Deep Woods',
            new AreaDescriptions(`Dense forest that branches off from the West Aston Road.`),
            EAreaType.FOREST,
            7,
            10,
        );
        const aston = new Area(
            'Aston',
            getTownDescription().getWithCustomRoot(
                'A moderate-sized city in the Western Region of the Elora Continent.',
            ),
            EAreaType.TOWN,
            7,
            7,
        );

        // Todo, add more links between
        const melodon = new Area(
            'Melodon',
            getTownDescription().getWithCustomRoot(
                `The capital city of the Melodon Empire dominating over Elora's Western Region.`,
            ),
            EAreaType.TOWN,
            13,
            13,
        );

        const voidSpace = new Area(
            'Void Space',
            new AreaDescriptions(`A strange region of void space wtih mysteries defying comprehension.`),
            EAreaType.FOREST,
            20,
            20,
        );

        this.globalAreaList.push(G_AREA_GREENVALE);
        this.globalAreaList.push(greenvaleOutskirts);
        this.globalAreaList.push(greenvaleForest);
        this.globalAreaList.push(greenvaleMine);
        this.globalAreaList.push(westAstonRoad);
        this.globalAreaList.push(astonRoadDeepWoods);
        this.globalAreaList.push(aston);
        this.globalAreaList.push(melodon);
        this.globalAreaList.push(voidSpace);

        this.connectAreas(G_AREA_GREENVALE, greenvaleOutskirts);
        this.connectAreas(greenvaleOutskirts, greenvaleForest);
        this.connectAreas(greenvaleOutskirts, greenvaleMine);
        this.connectAreas(greenvaleOutskirts, westAstonRoad);
        this.connectAreas(westAstonRoad, astonRoadDeepWoods);
        this.connectAreas(westAstonRoad, aston);

        // Todo, add more links between
        this.connectAreas(aston, melodon);
        this.connectAreas(aston, voidSpace);
    }
}
