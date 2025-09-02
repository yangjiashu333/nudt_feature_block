import type { Classifier } from '@/types/classifier';

export const mockClassifiers: Classifier[] = [
  {
    id: 1,
    name: 'SVM',
    description: 'Support Vector Machine for classification',
    params_schema: JSON.stringify({
      kernel: { type: 'string', default: 'rbf', description: 'Kernel type' },
      C: { type: 'number', default: 1.0, description: 'Regularization parameter' },
      gamma: { type: 'string', default: 'scale', description: 'Kernel coefficient' },
    }),
  },
  {
    id: 2,
    name: 'Random Forest',
    description: 'Random forest classifier for robust predictions',
    params_schema: JSON.stringify({
      n_estimators: { type: 'integer', default: 100, description: 'Number of trees' },
      max_depth: { type: 'integer', description: 'Maximum depth of trees' },
      min_samples_split: { type: 'integer', default: 2, description: 'Minimum samples to split' },
      min_samples_leaf: { type: 'integer', default: 1, description: 'Minimum samples per leaf' },
    }),
  },
  {
    id: 3,
    name: 'XGBoost',
    description: 'Extreme Gradient Boosting for high performance',
    params_schema: JSON.stringify({
      n_estimators: { type: 'integer', default: 100, description: 'Number of boosting rounds' },
      learning_rate: { type: 'number', default: 0.1, description: 'Step size shrinkage' },
      max_depth: { type: 'integer', default: 6, description: 'Maximum tree depth' },
      subsample: { type: 'number', default: 1.0, description: 'Subsample ratio' },
    }),
  },
  {
    id: 4,
    name: 'Logistic Regression',
    description: 'Linear classifier for probabilistic predictions',
    params_schema: JSON.stringify({
      penalty: { type: 'string', default: 'l2', description: 'Regularization penalty' },
      C: { type: 'number', default: 1.0, description: 'Inverse regularization strength' },
      solver: { type: 'string', default: 'lbfgs', description: 'Optimization algorithm' },
    }),
  },
  {
    id: 5,
    name: 'Naive Bayes',
    description: 'Probabilistic classifier based on Bayes theorem',
  },
  {
    id: 6,
    name: 'Neural Network',
    description: 'Multi-layer perceptron classifier',
    params_schema: JSON.stringify({
      hidden_layer_sizes: { type: 'array', default: [100], description: 'Hidden layer sizes' },
      activation: { type: 'string', default: 'relu', description: 'Activation function' },
      learning_rate_init: { type: 'number', default: 0.001, description: 'Initial learning rate' },
      max_iter: { type: 'integer', default: 200, description: 'Maximum iterations' },
    }),
  },
];
