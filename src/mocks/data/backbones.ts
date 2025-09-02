import type { Backbone } from '@/types/backbone';

export const mockBackbones: Backbone[] = [
  {
    id: 1,
    name: 'ResNet50',
    description: 'Deep residual learning for image recognition',
    params_schema: JSON.stringify({
      layers: { type: 'integer', default: 50, description: 'Number of layers' },
      pretrained: { type: 'boolean', default: true, description: 'Use pretrained weights' },
      num_classes: { type: 'integer', default: 1000, description: 'Number of output classes' },
    }),
  },
  {
    id: 2,
    name: 'VGG16',
    description: 'Very deep convolutional networks for large-scale image recognition',
    params_schema: JSON.stringify({
      batch_norm: { type: 'boolean', default: false, description: 'Use batch normalization' },
      dropout: { type: 'number', default: 0.5, description: 'Dropout rate' },
      num_classes: { type: 'integer', default: 1000, description: 'Number of output classes' },
    }),
  },
  {
    id: 3,
    name: 'EfficientNet-B0',
    description: 'EfficientNets: Rethinking Model Scaling for Convolutional Neural Networks',
    params_schema: JSON.stringify({
      width_coefficient: { type: 'number', default: 1.0, description: 'Width scaling coefficient' },
      depth_coefficient: { type: 'number', default: 1.0, description: 'Depth scaling coefficient' },
      dropout_rate: { type: 'number', default: 0.2, description: 'Dropout rate' },
    }),
  },
  {
    id: 4,
    name: 'MobileNetV2',
    description: 'Inverted residuals and linear bottlenecks',
  },
  {
    id: 5,
    name: 'DenseNet121',
    description: 'Densely connected convolutional networks',
    params_schema: JSON.stringify({
      growth_rate: { type: 'integer', default: 32, description: 'Growth rate' },
      num_init_features: {
        type: 'integer',
        default: 64,
        description: 'Number of initial features',
      },
      drop_rate: { type: 'number', default: 0.0, description: 'Drop rate' },
    }),
  },
];
