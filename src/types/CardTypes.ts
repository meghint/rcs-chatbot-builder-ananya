export interface ButtonData {
	id: string;
	label: string;
	action: string;
	type?: string;
	title?: string;
	[key: string]: unknown;
  }
  
  export interface ChipData {
	id: string;
	label: string;
	[key: string]: unknown;
  }
  
  export interface RichCardData {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	buttons: ButtonData[];
	[key: string]: unknown;
  }
  
  export interface CarouselCardData {
	cards: RichCardData[];
	[key: string]: unknown;
  }