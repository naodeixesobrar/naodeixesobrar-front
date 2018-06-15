const urlBackend = function UrlBackend() {
    /*if (window.location.host === 'localhost:3000') {
        // return `https://192.168.0.166/agrotis-as/`;
        return 'http://localhost:8080/';
    } else if ((window.location.protocol === 'https:') && (window.location.port !== 443)) {
        return `https://${window.location.host}/agrotis-as/`;
    }*/
    return `http://localhost:8080/`;
};

const urlFrontend = function urlFront() {
    return `${window.location.protocol}//${window.location.host}`;
};

export { urlBackend, urlFrontend };
