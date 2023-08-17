export function getParam(url) {
    try {
        const params_before = url.split('?')[1];
        const params = params_before.split('&');
        for (let i = 0; i < params.length; i++) {
            params[i] = params[i].split('=');
        }

        const getFunc = {
            get: (name) => {
                for (let i = 0; i < params.length; i++) {
                    if (params[i][0] === name) {
                        return params[i][1];
                    }
                }
            }
        }

        return getFunc;
    }catch (e) {
        return {
            get: () => {
                return null;
            }
        }
    }
}