import { Routes } from '@angular/router';
import { ModelTraining } from './components/model-training/model-training';
import { SuggestionConfig } from './components/suggestion-config/suggestion-config';

export const AI_ENGINE_ROUTES: Routes = [
  { path: '', redirectTo: 'config', pathMatch: 'full' },
  { path: 'training', component: ModelTraining },
  { path: 'config', component: SuggestionConfig },
];
