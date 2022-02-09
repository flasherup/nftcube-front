export const processTextReplaces = (text:string) => {
    const parts = text.split('[LINK');
    const res = new Array()
    parts.forEach(part=> {
        const linkIndex = part.indexOf('=');
        let linkEndIndex = part.indexOf(']');
        if (linkIndex === -1 || linkEndIndex === -1) {
            res.push(part);
            return;
        }
        const l = part.substring(linkIndex+1, linkEndIndex);
        const textEndIndex = part.indexOf('[/]')
        let t = part.substring(linkEndIndex+1, textEndIndex);
        res.push(<a key={l} target="_blank" href={l}>{t}</a>)
        res.push(part.substring(textEndIndex + 3));
    })
    return res
}