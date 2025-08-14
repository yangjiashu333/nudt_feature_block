import type { Modality } from '@/types/common';
import type { Feature } from '@/types/feature';

export const mockFeatures: Feature[] = [
  {
    id: 1,
    name: 'Age Feature',
    modality: 'SAR',
    description: 'User age from profile data',
  },
  {
    id: 2,
    name: 'Click Rate',
    modality: 'RD',
    description: 'User click through rate on ads',
  },
  {
    id: 3,
    name: 'Purchase History',
    modality: '1D',
    description: 'Historical purchase patterns',
  },
  {
    id: 4,
    name: 'Location Data',
    modality: 'SAR',
    description: 'Geographic location preferences',
  },
];

export const getNextFeatureId = (): number => {
  return Math.max(...mockFeatures.map((f) => f.id)) + 1;
};

export const createFeature = (name: string, modality: Modality, description?: string): Feature => {
  const newFeature: Feature = {
    id: getNextFeatureId(),
    name,
    modality,
    description,
  };
  mockFeatures.push(newFeature);
  return newFeature;
};

export const findFeatureById = (id: number): Feature | undefined => {
  return mockFeatures.find((feature) => feature.id === id);
};

export const updateFeature = (
  id: number,
  updates: { name?: string; modality?: string; description?: string }
): Feature | undefined => {
  const feature = findFeatureById(id);
  if (feature) {
    Object.assign(feature, updates);
  }
  return feature;
};

export const deleteFeature = (id: number): boolean => {
  const index = mockFeatures.findIndex((feature) => feature.id === id);
  if (index !== -1) {
    mockFeatures.splice(index, 1);
    return true;
  }
  return false;
};
