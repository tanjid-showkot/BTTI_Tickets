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
        const endTime = performance.now();
        console.log(`API Response Time: ${(endTime - startTime).toFixed(2)}ms`);
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};


export const addUser = async (token, data) => {
    try {
        const response = await fetch(`${url}account/users/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const getTicketForAccount = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/account/tickets/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};
export const sellTicket = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/sell-tickets/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};


export const getAccountDashboard = async (token, date) => {
    try {
        const response = await fetch(`${url}ticket-management/account-dashboard/${date.day}/${date.month}/${date.year}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

