import { urlFrontend } from '../utils/urlUtils';
import ls from 'react-native-local-storage';

function processarResposta(response, callbackErroPersonalizado = undefined) {
    if (response.status === undefined) {
        if (!callbackErroPersonalizado) {
            throw response;
        } else {
            return callbackErroPersonalizado(response);
        }
    } else if (response.status >= 400) {
        if (response.status === 401) {
            setTimeout(window.location = `${urlFrontend()}/#/login`, 100);
            return null;
        }
        if (response.headers.get('Content-Type') === 'application/json') {
            return response.json().then((error) => { throw error; });
        }
        throw response;
    } else if (response.headers.get('Content-Type') === 'application/json') {
        return response.json();
    } else {
        return null;
    }
}

function montarHeaders(usarToken = true) {
    return ls.get('ls.token').then(token => {
        const headers = {
            accept: 'application/json',
            'Content-Type': 'application/json',
        };
        if (usarToken && token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    })
}

function restPut(url, body, headers, callbackErroPersonalizado) {
    return montarHeaders().then(h => {
        return fetch(url, {
            method: 'PUT',
            headers: Object.assign(h, headers),
            body: JSON.stringify(body),
        }).then(response => {
            return processarResposta(response);
        });

    });
}

function restPost(url, body, headers, usarToken = true) {
    return montarHeaders().then(h => {
        return fetch(url, {
            method: 'POST',
            headers: Object.assign(h, headers),
            body: JSON.stringify(body),
        }).then(response => {
            return processarResposta(response);
        });

    });
}

function restGet(url, headers) {
    return montarHeaders().then(h => {
        return fetch(url, {
            method: 'GET',
            headers: Object.assign(h, headers),
        }).then(response => {
            return processarResposta(response);
        });

    });
}

function restGetPDF(url, body, headers) {
    return fetch(url, {
        method: 'GET',
        headers: Object.assign({
            accept: ['application/pdf', 'application/json'],
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ls.get('ls.token')}`,
        }, headers),
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.status >= 400) {
            if (response.headers.get('Content-Type') === 'application/json') {
                return response.json().then((error) => { throw error; });
            }
            throw response;
        } else {
            return response.blob().then((resp) => {
                const fileURL = URL.createObjectURL(resp);
                const aba = window.open(fileURL, '_blank');
                if (!aba || aba === null) {
                    const erro = [{ mensagem: 'O navegador bloqueou a abertura do arquivo, verifique as configurações deste.' }];
                    throw erro;
                }
            });
        }
    });
}

function restGetCSV(url, body, headers) {
    return fetch(url, {
        method: 'GET',
        headers: Object.assign({
            accept: ['text/csv; charset=utf-8', 'application/json'],
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ls.get('ls.token')}`,
        }, headers),
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.status >= 400) {
            if (response.headers.get('Content-Type') === 'application/json') {
                return response.json().then((error) => { throw error; });
            }
            throw response;
        } else {
            return response.blob().then((resp) => {
                const fileURL = URL.createObjectURL(resp);
                const w = window.open(fileURL, 'file.csv');
                if (!w || w === null) {
                    const erro = [{ mensagem: 'O navegador bloqueou a abertura do arquivo, verifique as configurações deste.' }];
                    throw erro;
                }

                const downloadLink = w.document.createElement('a');
                downloadLink.href = fileURL;
                const date = new Date();
                let dia;
                let mes;

                if (date.getDate() < 10) {
                    dia = '0'.concat(date.getDate());
                } else {
                    dia = date.getDate();
                }

                if (date.getMonth() < 10) {
                    mes = '0'.concat(date.getMonth() + 1);
                } else {
                    mes = (date.getMonth() + 1);
                }

                // "receitaDDMMYYYY.csv"
                downloadLink.download = 'receita'
                    .concat(dia)
                    .concat(mes)
                    .concat(date.getFullYear())
                    .concat('.csv');

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        }
    });
}

function restDelete(url, headers) {
    return fetch(url, {
        method: 'DELETE',
        headers: Object.assign(montarHeaders(), headers),
    }).then(response => processarResposta(response))
        .catch(error => processarResposta(error));
}

function restPostArquivo(url, form) {
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/octet-stream',
            Authorization: `Bearer ${ls.get('ls.token')}`,
        },
        body: form,
    }).then(response => processarResposta(response))
        .catch(error => processarResposta(error));
}
export { restGet, restPost, restPut, restDelete, restGetPDF, restGetCSV, restPostArquivo };
