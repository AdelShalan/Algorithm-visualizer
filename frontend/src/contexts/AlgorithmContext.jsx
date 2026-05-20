import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const AlgorithmContext = createContext();

export function AlgorithmProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const generatorFnRef = useRef(null);
  const generatorInstanceRef = useRef(null);
  const isGeneratorMode = useRef(false);
  const generatorStepRef = useRef(0);
  const delayRef = useRef(140);

  const setGenerator = useCallback((fn) => { generatorFnRef.current = fn; }, []);

  const getDelay = useCallback(() => {
    return Math.max(20, 300 - (speed * 2.8));
  }, [speed]);

  useEffect(() => {
    delayRef.current = getDelay();
  }, [getDelay]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const consumeGenerator = useCallback(() => {
    if (!generatorInstanceRef.current) return;
    clearTimer();

    const tick = () => {
      const next = generatorInstanceRef.current.next();
      if (!next.done) {
        const stepIndex = generatorStepRef.current;
        setSteps(prev => [...prev, next.value]);
        setCurrentStep(stepIndex);
        generatorStepRef.current += 1;
        timeoutRef.current = setTimeout(tick, delayRef.current);
      } else {
        isGeneratorMode.current = false;
        generatorInstanceRef.current = null;
        setIsComplete(true);
        setIsPlaying(false);
      }
    };
    tick();
  }, [clearTimer]);

  const runGenerator = useCallback(() => {
    const result = generatorFnRef.current?.();
    if (result && typeof result.next === 'function' && typeof result[Symbol.iterator] === 'function') {
      isGeneratorMode.current = true;
      generatorStepRef.current = 0;
      generatorInstanceRef.current = result;
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(true);
      setIsComplete(false);
      consumeGenerator();
    }
  }, [consumeGenerator]);

  const scheduleNext = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        return next;
      });
    }, getDelay());
  }, [getDelay, clearTimer]);

  // Auto-advance when playing (only for pre-computed steps, not generator mode)
  useEffect(() => {
    if (isGeneratorMode.current) return;
    if (!isPlaying || steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      setIsComplete(true);
      clearTimer();
      return;
    }
    scheduleNext();
    return () => clearTimer();
  }, [isPlaying, currentStep, steps.length, scheduleNext, clearTimer]);

  const startAnimation = useCallback((newSteps) => {
    isGeneratorMode.current = false;
    generatorStepRef.current = 0;
    generatorInstanceRef.current = null;
    clearTimer();
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    setIsComplete(false);
  }, [clearTimer]);

  const stopAnimation = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const resetAnimation = useCallback(() => {
    isGeneratorMode.current = false;
    generatorStepRef.current = 0;
    generatorInstanceRef.current = null;
    stopAnimation();
    setSteps([]);
    setCurrentStep(0);
    setIsComplete(false);
  }, [stopAnimation]);

  const stepForward = useCallback(() => {
    clearTimer();
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        setIsPlaying(false);
        setIsComplete(true);
        return prev;
      }
      return next;
    });
  }, [steps.length, clearTimer]);

  const stepBackward = useCallback(() => {
    clearTimer();
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, [clearTimer]);

  const goToStep = useCallback((step) => {
    clearTimer();
    setCurrentStep(step);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (isGeneratorMode.current) {
      if (generatorInstanceRef.current) {
        setIsPlaying(true);
        setIsComplete(false);
        consumeGenerator();
      }
      return;
    }
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
    setIsComplete(false);
  }, [steps.length, currentStep, consumeGenerator]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  return (
    <AlgorithmContext.Provider value={{
      isPlaying,
      speed,
      setSpeed,
      currentStep,
      steps,
      isComplete,
      startAnimation,
      stopAnimation,
      resetAnimation,
      stepForward,
      stepBackward,
      goToStep,
      play,
      pause,
      getDelay,
      timeoutRef,
      setCurrentStep,
      setIsPlaying,
      setIsComplete,
      setGenerator,
      runGenerator,
    }}>
      {children}
    </AlgorithmContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlgorithm() {
  const context = useContext(AlgorithmContext);
  if (!context) throw new Error('useAlgorithm must be used within AlgorithmProvider');
  return context;
}
