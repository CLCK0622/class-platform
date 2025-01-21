export const metadata = {
    title: '选课报课网站',
    description: '登录和注册页面',
};

import '../style/globals.scss';
import Footer from './components/footer';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="app-container">
                <main className="content">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
