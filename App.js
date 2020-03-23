import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

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

const P = 4;

const POINTS = [
    {x1: 0, x2: 6, highLowRule: +1},
    {x1: 1, x2: 5, highLowRule: +1},
    {x1: 3, x2: 3, highLowRule: -1},
    {x1: 2, x2: 4, highLowRule: -1}
];

const accuracy = 5;

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

const perceptronTraining = (P, accuracy, learningSpeed, deadlines, paramW1 = 0, paramW2 = 0) => {
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
    performanceEnd = performance.now();
    const perceptronPerformanceTime = performanceEnd - performanceStart || 0;
    return [w1, w2, perceptronPerformanceTime, iretationCounter];
};

const geneticAccuracy = 0;

const mutationProbabilityLimit = .9;

const f = (a, b, c, d, EQUATION) => +(a * EQUATION.x1 + b * EQUATION.x2 + c * EQUATION.x3 + d * EQUATION.x4).toFixed(geneticAccuracy);

const populationGenerator = (genotypeQuantity, BOUNDARY) => {
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

const geneticAlgorithm = (generationsQuantityParam, crossoverLineIndex, BOUNDARY, EQUATION) => {
    const performanceStart = performance.now();
    let generationsQuantity = generationsQuantityParam;
    let performanceEnd, geneticAlgorithmPerformance;
    let population = populationGenerator(generationsQuantity, BOUNDARY);
    while (generationsQuantity >= 4) {
        const deltas = [];
        for (let gene = 0; gene < population.length; gene++) {
            const geneDelta = +Math.abs((f(...population[gene], EQUATION) - EQUATION.y)).toFixed(geneticAccuracy);
            if (geneDelta === 0) {
                performanceEnd = performance.now();
                geneticAlgorithmPerformance = performanceEnd - performanceStart;
                return {
                    population: population[gene],
                    generation: (generationsQuantity / generationsQuantityParam),
                    deviance: 0,
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
        /*  [МУТАЦІЯ]   */
        for (let gene = 0; gene < population.length; gene++) {
            const geneMutationProbability = Math.random();
            if (geneMutationProbability > mutationProbabilityLimit) {
                for (let geneMember = 0; geneMember < population[gene].length; geneMember++) {
                    population[gene][geneMember] += +(Math.random() * 2 * BOUNDARY - BOUNDARY).toFixed(geneticAccuracy);
                };
            };
        };
        /*  [МУТАЦІЯ]   */
        generationsQuantity /= 2;
    };
    performanceEnd = performance.now();
    geneticAlgorithmPerformance = performanceEnd - performanceStart;
    const deviance = ((f(...population[0], EQUATION) - EQUATION.y) / f(...population[0], EQUATION)).toFixed(2) * 100;
    return {
        population: (population.length === 1) ? population : population[0],
        generation: Math.log2(generationsQuantityParam) - 1,
        deviance: deviance,
        performanceTime: geneticAlgorithmPerformance
    };
};

export default function App() {
  const [factorizedNumber, setFactorizedNumber] = useState('');
  const [factorizedNumberAnswer, setFactorizedNumberAnswer] = useState('');
  const [learningSpeed, setLearningSpeed] = useState(.001);
  const [temporalDeadline, setTemporalDeadline] = useState(.05);
  const [iterativeDeadline, setIterativeDeadline] = useState(100);
  const [perceptronTrainingAnswer, setPerceptronTrainingAnswer] = useState(null);
  const [equation, setEquation] = useState({});
  const [generationsQuantity, setGenerationsQuantity] = useState(0);
  const [crossoverLineIndex, setCrossoverLineIndex] = useState(0);
  const [equationAnswer, setEquationAnswer] = useState({});
  const deadlines = {
    temporal: {isUsed: temporalDeadline > 0, seconds: temporalDeadline},
    iterative: {isUsed: iterativeDeadline > 0, iterations: iterativeDeadline}
  };
  const BOUNDARY = +(equation.y / 2).toFixed(geneticAccuracy) || 0;
  return (
    <View style={styles.container}>
      <Text style={styles.filler}></Text>
      <Text style={styles.header}>Fermat's Factorization Method</Text>
      <Text>{`A  *  B  =  ${factorizedNumber || ''}`}</Text>
      <TextInput placeholder="Set Number" keyboardType="number-pad" onChangeText={text => setFactorizedNumber(text)}></TextInput>
      <Button title="Number Factorization" onPress={() => setFactorizedNumberAnswer(fErmatFactorization(+factorizedNumber))}></Button>
      <Text>{factorizedNumberAnswer && `A  =  ${factorizedNumberAnswer[0]}  &  B  =  ${factorizedNumberAnswer[1]}`}</Text>
      <Text>{factorizedNumberAnswer && `Time spent:  ${factorizedNumberAnswer[2].toFixed(5)} ms`}</Text>
      <Text style={styles.header}>Perceptron Model</Text>
      <Text>Trigger Threshold: P = 4</Text>
      <Text>Points: +A(0, 6), +B(1, 5), -C(3, 3) And -D(2, 4)</Text>
      <TextInput placeholder="Learning Speed (0.001 by default)" keyboardType="number-pad" onChangeText={text => setLearningSpeed(text)}></TextInput>
      <TextInput placeholder="Temporal Deadline, seconds (0.5s by default)" keyboardType="number-pad" onChangeText={text => setTemporalDeadline(text)}></TextInput>
      <TextInput placeholder="Iterative Deadline (100 by default)" keyboardType="number-pad" onChangeText={text => setIterativeDeadline(text)}></TextInput>
      <Button title="Train Perceptron" onPress={() => setPerceptronTrainingAnswer(perceptronTraining(P, 5, learningSpeed, deadlines))}></Button>
      <Text>{perceptronTrainingAnswer && `W1  =  ${perceptronTrainingAnswer[0]}  &  W2  =  ${perceptronTrainingAnswer[1]}`}</Text>
      <Text>{perceptronTrainingAnswer && `Time spent:  ${perceptronTrainingAnswer[2].toFixed(5)} ms`}</Text>
      <Text>{perceptronTrainingAnswer && `Iterations: ${perceptronTrainingAnswer[3]}`}</Text>
      <Text>{perceptronTrainingAnswer && 'Checkup:'}</Text>
      <Text>{perceptronTrainingAnswer && `A: ${POINTS[0].x1} * ${perceptronTrainingAnswer[0]} + ${POINTS[0].x2} * ${perceptronTrainingAnswer[1]} = ${outputSignal(POINTS[0], perceptronTrainingAnswer[0], perceptronTrainingAnswer[1])} > P`}</Text>
      <Text>{perceptronTrainingAnswer && `B: ${POINTS[1].x1} * ${perceptronTrainingAnswer[0]} + ${POINTS[1].x2} * ${perceptronTrainingAnswer[1]} = ${outputSignal(POINTS[1], perceptronTrainingAnswer[0], perceptronTrainingAnswer[1])} > P`}</Text>
      <Text>{perceptronTrainingAnswer && `C: ${POINTS[2].x1} * ${perceptronTrainingAnswer[0]} + ${POINTS[2].x2} * ${perceptronTrainingAnswer[1]} = ${outputSignal(POINTS[2], perceptronTrainingAnswer[0], perceptronTrainingAnswer[1])} < P`}</Text>
      <Text>{perceptronTrainingAnswer && `D: ${POINTS[3].x1} * ${perceptronTrainingAnswer[0]} + ${POINTS[3].x2} * ${perceptronTrainingAnswer[1]} = ${outputSignal(POINTS[3], perceptronTrainingAnswer[0], perceptronTrainingAnswer[1])} < P`}</Text>
      <Text style={styles.header}>Genetic Algorithm Research</Text>
      <Text>{`Diophantine Equation: a * ${equation.x1 || 'x1'} + b * ${equation.x2 || 'x2'} + c * ${equation.x3 || 'x3'} + d * ${equation.x4 || 'x4'} = ${equation.y || 'y'}`}</Text>
      <TextInput placeholder="Enter commas separated values of x1, x2, x3, x4, y" onChangeText={text => {
        const newEquationFromText = JSON.parse(`[${text}]`);
        const newEquation = {
          x1: newEquationFromText[0],
          x2: newEquationFromText[1],
          x3: newEquationFromText[2],
          x4: newEquationFromText[3],
          y: newEquationFromText[4]
        };
        setEquation(newEquation);
      }}></TextInput>
      <TextInput placeholder="Generations Quantity (2^value desirable)" keyboardType="number-pad" onChangeText={text => setGenerationsQuantity(text)}></TextInput>
      <TextInput placeholder="Enter Crossover Line Index (1, 2 or 3)" keyboardType="number-pad" onChangeText={text => setCrossoverLineIndex(text)}></TextInput>
      <Button title="Integer Roots Search" onPress={() => setEquationAnswer(geneticAlgorithm(generationsQuantity, crossoverLineIndex, BOUNDARY, equation))}></Button>
      <Text>{equationAnswer.population && `a  =  ${equationAnswer.population[0]}  &  b  =  ${equationAnswer.population[1]}  &  c  =  ${equationAnswer.population[2]}  &  d  =  ${equationAnswer.population[3]}`}</Text>
      <Text>{equationAnswer.generation && `Generation: ${equationAnswer.generation}`}</Text>
      <Text>{equationAnswer.population && `Deviance: ${equationAnswer.deviance}%`}</Text>
      <Text>{equationAnswer.performanceTime && `Time spent:  ${equationAnswer.performanceTime.toFixed(5)} ms`}</Text>
      <Text>{equationAnswer.population && 'Checkup:'}</Text>
      <Text>{equationAnswer.population && `${equationAnswer.population[0]} * ${equation.x1} + ${equationAnswer.population[1]} * ${equation.x2} + ${equationAnswer.population[2]} * ${equation.x3} + ${equationAnswer.population[3]} * ${equation.x4} = ${equation.y}`}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 30,
    fontSize: 18
  },
  filler: {
    paddingBottom: 75
  }
});