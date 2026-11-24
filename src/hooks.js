import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from './context/AppContext';
import { chapters } from './data';
export const useStoredState = (key, initial) => { 
// useStoredState(key, initial): like useState, but it loads from and saves to the phone's storage.
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => { if (raw) setValue({ ...initial, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [key]);
  const save = useCallback((next) => {
    setValue(next);
    AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
  }, [key]);
  return [value, save, ready];
};
export const useCourseProgress = (course) => { // useCourseProgress(course): everything about how far the learner is in one course.
  const { store } = useApp(); // reads the shared data through context
  return useMemo(() => {
    const ex = chapters(course)[0].ex;
    const doneList = store.done[course.id] || [];
    const xpTotal = ex.reduce((a, e) => a + e.xp, 0);
    const xpGot = ex.reduce((a, e, i) => a + (doneList.includes(i) ? e.xp : 0), 0);
    return { doneList, done: doneList.length, total: ex.length, pct: doneList.length / ex.length, xpGot, xpTotal, isDone: (i) => doneList.includes(i) };
  }, [store.done, course.id]);
};
