import React from 'react';

interface NavigationRef {
  navigate(name: string, params?: any): void;
}

export const navigationRef = React.createRef<NavigationRef>();

const navigate = (name: string, params?: any) =>
  navigationRef.current?.navigate(name, params);

export default {
  navigate,
};
