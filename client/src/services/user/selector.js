import { createSelector } from '@reduxjs/toolkit';

export const getUser = createSelector(
  state => state.user,
  entity => entity
);
