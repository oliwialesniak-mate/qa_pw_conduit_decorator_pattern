import { camelCaseToPhrase, capitalize } from '../helpers/stringHelpers';
import { Logger } from '../logger/Logger';

//
// Decorator: add user ID prefix
//
export function decorateWithUserId(fn, userId = 0) {
  return async function (title, stepToRun) {
    const stepTitle = userId > 0 ? `User${userId}: ${title}` : title;
    return await fn(stepTitle, stepToRun);
  };
}

//
// Decorator: convert function name to readable step title
//
export function decorateWithTitleFromFunction(fn) {
  return async function (functionName, stepToRun) {
    const stepTitle = capitalize(camelCaseToPhrase(functionName));
    return await fn(stepTitle, stepToRun);
  };
}

//
// Decorator: logs step timing using REQUIRED singleton logger pattern
//
export function decorateWithTiming(fn) {
  // IMPORTANT: task requires no parameters and exact singleton accessor
  const logger = Logger.getInstanse();

  return async function (title, stepToRun) {
    const wrapped = async () => {
      const startTime = Date.now();
      logger.info(`Step "${title}" started at ${new Date(startTime).toISOString()}`);

      try {
        return await stepToRun();
      } finally {
        const endTime = Date.now();
        const duration = endTime - startTime;
        logger.info(
          `Step "${title}" ended at ${new Date(endTime).toISOString()} (${duration}ms)`
        );
      }
    };

    return await fn(title, wrapped);
  };
}

export { expect } from '@playwright/test';
