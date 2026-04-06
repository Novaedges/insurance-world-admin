import { Routes } from '@angular/router';
import { SegmentBuilder } from './components/segment-builder/segment-builder';
import { CampaignWorkflow } from './components/campaign-workflow/campaign-workflow';
import { Analytics } from './components/analytics/analytics';
import { PromotionalBannerComponent } from './components/promotional-banner/promotional-banner.component';

export const MARKETING_ROUTES: Routes = [
  { path: '', redirectTo: 'campaigns', pathMatch: 'full' },
  { path: 'segments', component: SegmentBuilder },
  { path: 'campaigns', component: CampaignWorkflow },
  { path: 'analytics', component: Analytics },
  { path: 'banners', component: PromotionalBannerComponent },
];
