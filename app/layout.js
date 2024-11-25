import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
    title: 'Book Krlo Admin',
    description: 'Manage event guests and tickets',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                {children}
                <Toaster position='top-right' />
            </body>
        </html>
    );
}
