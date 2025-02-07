const url = "https://brtc.pythonanywhere.com/api/"
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        const message = JSON.stringify(errorData);
        console.log(message);
        throw new Error(message);
    }
    return response;
};
export const signIn = async (data) => {
    try {
        const startTime = performance.now();
        const response = await fetch(`${url}account/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const endTime = performance.now(); // End measuring
        console.log(`API Response Time: ${(endTime - startTime).toFixed(2)}ms`);

        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const VerifyToken = async (token) => {
    try {
        const startTime = performance.now(); // Start measuring
        const response = await fetch(`${url}account/verify-token/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
        const endTime = performance.now(); // End measuring
        console.log(`API Response Time: ${(endTime - startTime).toFixed(2)}ms`);
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};