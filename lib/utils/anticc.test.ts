import { describe, expect, it } from 'vitest';

import { solveAntiCC } from './anticc';

describe('anticc', () => {
    it('should solve prepending pattern', () => {
        const html = `
            <html id='anticc_js_concat'><body><script language='javascript'>
                var url='';
                url='61334439'+ url;
                url=   '1' +   url;
                url= '7940109_' +   url;
                url=  'eafa5176'   +   url;
                url= 'd194a'+url;
                url=  '0fcf'   +   url;
                url= 'ebca65'+url;
                url='45e0f'+ url;
                url='125112'  +   url;
                url= 'Y=3c'  +  url;
                url=  '/?__H' +url;;
                window.location=url;
            </script></body></html>
        `;
        const expected = '/?__HY=3c12511245e0febca650fcfd194aeafa51767940109_161334439';
        expect(solveAntiCC(html)).toBe(expected);
    });

    it('should solve mixed patterns', () => {
        const html = `
            <html id='anticc_js_concat'><body><script language='javascript'>
                var url='/path';
                url=url + '?';
                url=url + 'key=';
                url='prefix_' + url;
                window.location=url;
            </script></body></html>
        `;
        const expected = 'prefix_/path?key=';
        expect(solveAntiCC(html)).toBe(expected);
    });

    it('should return null for non-anticc html', () => {
        const html = `<html><body>some content</body></html>`;
        expect(solveAntiCC(html)).toBeNull();
    });

    it('should handle direct assignment', () => {
        const html = `
            <html id='anticc_js_concat'><body><script language='javascript'>
                var url='https://example.com/redirect';
                window.location=url;
            </script></body></html>
        `;
        expect(solveAntiCC(html)).toBe('https://example.com/redirect');
    });
});
