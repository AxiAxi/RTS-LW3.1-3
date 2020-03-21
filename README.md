# Системи реального часу
## Лабораторна робота №3 (1-3) (Android / iOS)
##### Основна програма розташована в папці "source" у файлі source.js. Реалізація роботи програми на Android / iOS виконана за допомогою фреймворку React Native + Expo (основна програма розташована у файлі App.js).
###### Виконав: Губенко М.Р. ІВ-72. ЗК №7206

### 3.1 Реалізація розкладання числа на прості множники (факторизація числа)
```javascript
const fErmatFactorization = number => {
    
    const performanceStart = performance.now();
    
    if ((number <= 0) || !(Number.isInteger(number))) {
        return;
    };
    
    if ((number % 2) === 0) {
        const performanceEnd = performance.now();
        const fErmatFactorizationPerformance = performanceEnd - performanceStart;
        return [number / 2, 2, fErmatFactorizationPerformance];
    };
    
    let a = Math.ceil(Math.sqrt(number));
    
    if (a**2 === number) {
        const performanceEnd = performance.now();
        const fErmatFactorizationPerformance = performanceEnd - performanceStart;
        return [a, a, fErmatFactorizationPerformance];
    };
    
    let b;
    
    while (true) {
        let b1 = a**2 - number;
        
        b = Math.sqrt(b1) | 0;
        
        if (b**2 === b1) {
            break;
        } else {
            a++;
        };
    };
    
    const performanceEnd = performance.now();
    
    const fErmatFactorizationPerformance = performanceEnd - performanceStart;
    
    return [a - b, a + b, fErmatFactorizationPerformance];
};
```

### 3.2 Дослідження нейронних мереж. Модель Perceptron
```javascript
const P = 4;

const POINTS = [
    {x1: 0, x2: 6, highLowRule: +1},
    {x1: 1, x2: 5, highLowRule: +1},
    {x1: 3, x2: 3, highLowRule: -1},
    {x1: 2, x2: 4, highLowRule: -1}
];

const accuracy = 0;

const learningSpeed = .001;

const deadlines = {
    temporal: {isUsed: false, seconds: .5},
    iterative: {isUsed: true, iterations: 100}
};

const outputSignal = (point, w1, w2) => +(point.x1 * w1 + point.x2 * w2).toFixed(accuracy);

const highLowCheck = (point, y, P) => {
    if (point.highLowRule === +1) {
        return y > P;
    } else if (point.highLowRule === -1) {
        return y < P;
    };
};

const w = (w, deltaRule, x, learningSpeed) => +(w + deltaRule * x * learningSpeed).toFixed(accuracy);

const outputSignalCheck = (points, w1, w2) => {
    let successCounter = 0;
    for (const point of points) {
        highLowCheck(point, outputSignal(point, w1, w2), P) && successCounter++;
    };
    return successCounter === POINTS.length;
};

const perceptronTraining = (P, accuracy, learningSpeed, paramW1 = 0, paramW2 = 0) => {
    let turn = 0;
    let w1 = paramW1, w2 = paramW2;
    let deltaRule = 0;
    let iretationCounter = 0;
    const performanceStart = performance.now();
    let performanceEnd;
    while (true) {
        const point = POINTS[turn];
        const y = outputSignal(point, w1, w2);
        if (highLowCheck(point, y, P) && outputSignalCheck(POINTS, w1, w2)) {
            break;
        };
        deltaRule = +(P - y).toFixed(accuracy);
        w1 = w(w1, deltaRule, point.x1, learningSpeed);
        w2 = w(w2, deltaRule, point.x2, learningSpeed);
        (turn === POINTS.length - 1) ? turn = 0 : turn++;
        iretationCounter++;
        if (deadlines.temporal.isUsed) {
            performanceEnd = performance.now();
            if ((performance.now() - performanceStart) >= (deadlines.temporal.seconds * 1000)) {
                break;
            };
        };
        if (deadlines.iterative.isUsed) {
            if (iretationCounter >= deadlines.iterative.iterations) {
                break;
            };
        };
    };
    const perceptronPerformanceTime = performanceEnd - performanceStart || 0;
    return [w1, w2, perceptronPerformanceTime, iretationCounter];
};
```

### 3.3 Дослідження генетичного алгоритму
```javascript
const EQUATION = {x1: 10, x2: -3, x3: 25, x4: -7, y: 126};

const geneticAccuracy = 0;

const BOUNDARY = +(EQUATION.y / 2).toFixed(geneticAccuracy);

const f = (a, b, c, d) => +(a * EQUATION.x1 + b * EQUATION.x2 + c * EQUATION.x3 + d * EQUATION.x4).toFixed(geneticAccuracy);

const populationGenerator = genotypeQuantity => {
    const population = [];
    for (let gene = 0; gene < genotypeQuantity; gene++) {
        const genotype = [];
        for (let id = 0; id < 4; id++) {
            genotype[id] = +(Math.random() * BOUNDARY).toFixed(geneticAccuracy);
        };
        population.push(genotype);
    };
    return population;
};

const genotypeCrossing = (genotypeA, genotypeB, crossoverLineIndex) => {
    const crossoverGeneA = genotypeA.slice(0, crossoverLineIndex);
    const crossoverGeneB = genotypeB.slice(0, crossoverLineIndex);
    const newGenotypeA = [...crossoverGeneB, ...genotypeA.slice(crossoverLineIndex, genotypeA.length)];
    const newGenotypeB = [...crossoverGeneA, ...genotypeB.slice(crossoverLineIndex, genotypeB.length)];
    return [newGenotypeA, newGenotypeB];
};

const geneticAlgorithm = (generationsQuantityParam, crossoverLineIndex = 1) => {
    const performanceStart = performance.now();
    let generationsQuantity = generationsQuantityParam;
    let performanceEnd, geneticAlgorithmPerformance;
    let population = populationGenerator(generationsQuantity);
    while (generationsQuantity > 2) {
        const deltas = [];
        for (let gene = 0; gene < population.length; gene++) {
            const geneDelta = +Math.abs((f(...population[gene]) - EQUATION.y)).toFixed(geneticAccuracy);
            if (geneDelta === 0) {
                performanceEnd = performance.now();
                geneticAlgorithmPerformance = performanceEnd - performanceStart;
                return {
                    population: population[gene],
                    generation: (generationsQuantity / generationsQuantityParam),
                    performanceTime: geneticAlgorithmPerformance
                };
            };
            deltas.push(geneDelta);
        };
        const reverseDeltas = deltas.map(delta => delta**(-1));
        const totalDeltasSum = deltas.reduce((deltasSum, delta) => deltasSum + delta**(-1), 0);
        const genotypeChoiceProbability = [];
        for (let gene = 0; gene < deltas.length; gene++) {
            genotypeChoiceProbability.push(+(reverseDeltas[gene] / totalDeltasSum).toFixed(geneticAccuracy));
        };
        const parentCoupleWithProbability = [...genotypeChoiceProbability].sort().reverse().reduce((result, value, index, array) => {
            ((index % 2) === 0) && result.push(array.slice(index, index + 2));
            return result;
        }, []).slice(0, genotypeChoiceProbability.length / 4);
        const parentCoupleWithValues = [];
        for (let gene = 0; gene < parentCoupleWithProbability.length; gene++) {
            parentCoupleWithValues.push([
                population[genotypeChoiceProbability.indexOf(parentCoupleWithProbability[gene][0])],
                population[genotypeChoiceProbability.indexOf(parentCoupleWithProbability[gene][1])]
            ]);
        };
        population = [];
        for (let gene = 0; gene < parentCoupleWithValues.length; gene++) {
            population.push(...genotypeCrossing(...parentCoupleWithValues[gene], crossoverLineIndex));
        };
        generationsQuantity /= 2;
    };
    performanceEnd = performance.now();
    geneticAlgorithmPerformance = performanceEnd - performanceStart;
    const deviance = ((f(...population[0]) - EQUATION.y) / f(...population[0])).toFixed(2) * 100;
    return {
        population: population,
        generation: Math.log2(generationsQuantityParam) - 1,
        deviance: deviance,
        performanceTime: geneticAlgorithmPerformance
    };
};
```

### Приклади виконання роботи програми:
![Test](/source/Test.jpg)
![Test0](/source/Test0.jpg)
![Test01](/source/Test01.jpg)
![Test1](/source/Test02.jpg)
![Test2](/source/Test03.jpg)
