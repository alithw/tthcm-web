const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Convert URL path to relative file path
    let urlPath = req.url.split('?')[0].split('#')[0];
    if (urlPath === '/') {
        urlPath = '/index.html';
    }

    const filePath = path.join(__dirname, urlPath);

    // Security check to prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden: Truy cập bị từ chối');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                const notFoundPath = path.join(__dirname, '404.html');
                fs.readFile(notFoundPath, (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(err404 ? '<h1>404 - Không Tìm Thấy Trang</h1>' : content404, 'utf-8');
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`Lỗi hệ thống: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  HỆ THỐNG ÔN TẬP TRẮC NGHIỆM TƯ TƯỞNG HỒ CHÍ MINH`);
    console.log(`  Đang chạy tại: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
