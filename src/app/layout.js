export const metadata = {
    title: '选课报课网站',
    description: '登录和注册页面',
};

import '../style/globals.scss';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
