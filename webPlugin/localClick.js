export default showSuccessToast => {
    document.ondblclick = async e => {
        const url = e.target.getAttribute('code-location');
        if (url) {
            const { hostname } = window.location;
            // window.open(`//${hostname}:${process.env.port}?${url}`);
            fetch(`//${hostname}:${process.env.port}?${url}`).then(async res => {
                const data = await res.json();
                if (data.code === 0) {
                    showSuccessToast(data.message);
                }
            });
        }
    };
};
