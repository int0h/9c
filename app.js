const dom = {
    personWeight: document.querySelector('#personWeight'),
    hangWeight: document.querySelector('#hangWeight'),
    pullWeight: document.querySelector('#pullWeight'),
    coreForm: document.querySelector('#coreForm'),
    coreTime: document.querySelector('#coreTime'),
    barHangTimeMin: document.querySelector('#barHangTimeMin'),
    barHangTimeSec: document.querySelector('#barHangTimeSec'),
    score: document.querySelector('#score'),
    grade: document.querySelector('#grade'),
}

/**
 * @typedef Data
 * @type {{[key in keyof typeof dom]: string | number}}
 */

function readForm() {
    /** @type {Data} */
    const data = {};
    for (const k of Object.keys(dom)) {
        data[k] = (dom[k] || {value: ''}).value;
    }
    return data;
}

/**
 *
 * @param {Array<[number, number]>} mapping
 * @param {number} val
 */
function mapValue(mapping, val, inBetween) {
    for (let i = mapping.length - 1; i >= 0; i--) {
        const [threshold, points] = mapping[i];
        if (val === threshold) {
            return points;
        }
        if (val >= threshold) {
            if (i >= mapping.length - 1) {
                return points;
            }
            if (!inBetween) {
                continue;
            }
            const [prevThreshold, prevThresholdPoints] = mapping[i + 1];
            const exDiff = prevThreshold - threshold;
            const pointsDiff = prevThresholdPoints - points;
            return points + pointsDiff * (val - threshold) / exDiff;
        }
    }
    return 0;
}

function calcResult() {
    const {barHangTimeMin, barHangTimeSec, coreForm, hangWeight, personWeight, pullWeight, coreTime} = readForm();
    const w = Number(personWeight);
    const barHangTime = Number(barHangTimeMin) + Number(barHangTimeSec) / 60;
    const hangPoints = mapValue(exerciseScoring.hangWeight, (Number(hangWeight) + w) / w * 100, true);
    const pullPoints = mapValue(exerciseScoring.pullWeight, (Number(pullWeight) + w) / w * 100, true);
    const corePoints = mapValue(exerciseScoring.core[coreForm], Number(coreTime), true);
    const barPoints = mapValue(exerciseScoring.barHang, barHangTime, true);
    const total = hangPoints + pullPoints + corePoints + barPoints;
    const grade = mapValue(gradeMap, Math.round(total));
    dom.score.textContent = total.toFixed(2);
    dom.grade.textContent = grade;
}

window.oninput = () => {
    calcResult();
}

const exerciseScoring = {
    hangWeight: [ // percents:
        [100, 1],
        [110, 2],
        [120, 3],
        [130, 4],
        [140, 5],
        [150, 6],
        [160, 7],
        [180, 8],
        [200, 9],
        [220, 10],
    ],
    pullWeight: [ // percents:
        [100, 1],
        [110, 2],
        [120, 3],
        [130, 4],
        [140, 5],
        [150, 6],
        [160, 7],
        [180, 8],
        [200, 9],
        [220, 10],
    ],
    core: { // seconds:
        bendLSit: [
            [10, 1],
            [20, 2],
            [30, 3],
        ],
        lSit: [
            [10, 4],
            [15, 5],
            [20, 6],
        ],
        frontLever: [
            [5, 7],
            [10, 8],
            [20, 9],
            [30, 10],
        ],
    },
    barHang: [ // minutes:
        [0.5, 1],
        [1.0, 2],
        [1.5, 3],
        [2.0, 4],
        [2.5, 5],
        [3.0, 6],
        [3.5, 7],
        [4.0, 8],
        [5.0, 9],
        [6.0, 10],
    ]
};

const gradeMap = [
    [40, '9c'],
    [39, '9b+'],
    [38, '9b'],
    [37, '9b'],
    [36, '9a+'],
    [35, '9a+'],
    [34, '9a'],
    [33, '9a'],
    [32, '8c+'],
    [31, '8c+'],
    [30, '8c'],
    [29, '8c'],
    [28, '8b+'],
    [27, '8b+'],
    [26, '8b'],
    [25, '8b'],
    [24, '8a+'],
    [23, '8a+'],
    [22, '8a'],
    [21, '8a'],
    [20, '7c+'],
    [19, '7c+'],
    [18, '7c'],
    [17, '7c'],
    [16, '7b+'],
    [15, '7b+'],
    [14, '7b'],
    [13, '7b'],
    [12, '7a+'],
    [11, '7a+'],
    [10, '7a'],
    [9, '7a'],
    [8, '6c+'],
    [7, '6c+'],
    [6, '6c'],
    [5, '6c'],
    [4, '6b'],
    [3, '6b'],
    [2, '6a'],
    [1, '6a'],
    [0, '5'],
].reverse();
