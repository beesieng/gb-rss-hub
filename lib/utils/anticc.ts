/**
 * Solves the Anti-CC challenge by parsing the JavaScript-based redirect URL.
 * The script typically looks like:
 * <html id='anticc_js_concat'><body><script language='javascript'>var url='';url='61334439'+ url;...;window.location=url;</script></body></html>
 * @param html The HTML content containing the anti-crawler script.
 * @returns The solved URL or null if not an anti-crawler challenge.
 */
export const solveAntiCC = (html: string): string | null => {
    if (!html.includes('anticc_js_concat')) {
        return null;
    }

    const scriptMatch = html.match(/<script language='javascript'>(.*)<\/script>/s);
    if (!scriptMatch) {
        return null;
    }

    const script = scriptMatch[1];
    let url = '';

    // Match patterns like:
    // var url='';
    // url='string'+ url;
    // url=url + 'string';
    // url='string';
    const assignmentRegex = /(?:var\s+)?url\s*=\s*([^;]+)/g;
    let match;
    while ((match = assignmentRegex.exec(script)) !== null) {
        const expression = match[1].trim();

        // Extract all string literals in the expression
        const stringLiteralRegex = /'(.*?)'/g;
        const literals: string[] = [];
        let literalMatch;
        while ((literalMatch = stringLiteralRegex.exec(expression)) !== null) {
            literals.push(literalMatch[1]);
        }

        const parts = expression.split(/\s*\+\s*/);
        let newVal = '';
        for (const part of parts) {
            if (part === 'url') {
                newVal += url;
            } else {
                const literalMatch = part.match(/'(.*?)'/);
                if (literalMatch) {
                    newVal += literalMatch[1];
                }
            }
        }
        url = newVal;
    }

    return url || null;
};
