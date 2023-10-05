import { AnimationBuilder } from '@ionic/core';

export interface IModalOptions {
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
