export interface Review {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    safariPackage?: string;
    helpful: number;
    verified: boolean;
}
