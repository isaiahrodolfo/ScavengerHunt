export type Callback = { 
  success: boolean; 
  error?: string; 
  type?: string;
  data?: any; // Any returned data
}