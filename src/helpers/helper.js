export const setItemToLocalStorage = (key, payload) => {
    if(!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(payload));
    } catch (error) {
        console.error("Localstorage setItem failed:", error);
    }
}

export const getItemFromLocalStorage = (key, fallback = null) => {
    if(!key) return fallback;

    try {
        const data = localStorage.getItem(key);
        if(data === null || data === undefined) return fallback;

        return JSON.parse(data);
    } catch (error) {
        console.error("localStorage getItem/parse failed:", error);
        return fallback;
    }
};

//remove only one key
export const removeItemFromLocalStorage = (key) => {
    if(!key) return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("localStorage removeItem failed:", error);
    }
};

//remove everything from localStorage
export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error("localStorage clear failed:", error);
    }
}

export const resolveImageUrl = (url, baseUrl) => {
    if(!url) {
        return "";
    }
    if(/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }
    const base = baseUrl || "";
    if(!base) {
        return url;
    }

    return `${base.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}