export const navigateToURL = (url: string, target?:string) => {
    if (!target)target = '_self'
    window.open(url, target);
}