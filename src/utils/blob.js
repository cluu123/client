export const base64toBlob = (base64Data, contentType) => {
    base64Data = base64Data.replace(/data:image\/png;base64,/g, '');
    contentType = contentType || '';
    const byteCharacters = window.atob(base64Data); // 解码 base64 字符串
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
};
