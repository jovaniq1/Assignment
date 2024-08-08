// Import the necessary method from 'expo-haptics'
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';

// Define a function named 'mediumHaptic' to trigger medium haptic feedback
export const mediumHaptic = () => {
  // Call the 'impactAsync' method with the 'Medium' impact feedback style
  impactAsync(ImpactFeedbackStyle.Medium);
};
