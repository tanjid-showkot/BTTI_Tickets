const url = "https://brtc.pythonanywhere.com/api/"
// const url = "http://127.0.0.1:8000/api/"
function getErrorMessage(response) {
    const { status } = response;

    switch (status) {
        case 400:
            return "Please check your input and try again.";
        case 401:
            return "You must be logged in to perform this action.";
        case 403:
            return "You don't have permission to access this resource.";
        case 404:
            return "The requested resource could not be found.";
        case 500:
            return "Something went wrong on our end. Please try again later.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}

const handleResponse = async (response) => {
    if (!response.ok) {
        // const errorData = await response.json();
        // const message = JSON.stringify(errorData);
        // console.log(message);
        // throw new Error(message);
        const message = getErrorMessage(response);
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
export const getUser = async (token) => {
    try {
        const response = await fetch(`${url}account/users/`, {
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
export const deleteUser = async (token, id) => {
    try {
        const response = await fetch(`${url}account/users/${id}/`, {
            method: "DELETE",
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
export const updateUser = async (token, id, data) => {
    try {
        const response = await fetch(`${url}account/users/${id}/`, {
            method: "PATCH",
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
export const createTicket = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/tickets/`, {
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
export const getTickets = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/tickets/`, {
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
export const updateTicketStatus = async (token, id, data) => {
    try {
        const response = await fetch(`${url}ticket-management/tickets/${id}/`, {
            method: "PATCH",
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
export const deleteTicket = async (token, id) => {
    try {
        const response = await fetch(`${url}ticket-management/tickets/${id}/`, {
            method: "DELETE",
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
export const getTicketSetting = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/settings/`, {
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
export const editTicketSetting = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/settings/`, {
            method: "PATCH",
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
export const adminDashboard = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/admin-dashboard/`, {
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
export const getSoldTicketRange = async (token, startDate, endDate) => {
    try {
        const response = await fetch(`${url}ticket-management/admin-sold-tickets/?start_date=${startDate}&end_date=${endDate}`, {
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


export const adminApproval = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/tickets-for-refund-approval/`, {
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

export const adminRefundApprove = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/approve-ticket-refund/`, {
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

export const adminRefundBulkApprove = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/bulk-approve-ticket-refund/`, {
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


export const adminRefundReject = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/reject-ticket-refund/`, {
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

export const adminRefundBulkReject = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/bulk-reject-ticket-refund/`, {
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


//verifier

export const getVerifyTicket = async (token, id) => {
    try {
        const response = await fetch(`${url}ticket-management/verify-sold-ticket/${id}/`, {
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

export const getPendingRefundTicket = async (token, date) => {

    try {
        const response = await fetch(`${url}ticket-management/get-pending-refund-tickets/${date}`, {
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
export const postRefundTicket = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/initiate-ticket-refund/`, {
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
export const postUseTicket = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/mark-as-used-sold-ticket/`, {
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

export const getTodayVerifierQueue = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/today-sold-tickets/`, {
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

export const hideVerifierTicket = async (token, id) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/hide-ticket/?id=${id}`, {
            method: "POST",
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

export const deferVerifierTicket = async (token, id) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/defer-ticket/?id=${id}`, {
            method: "POST",
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


//bulk Delete

export const bulkDeleteSoldTicketsCount = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/bulk-delete-sold-tickets-count/`, {
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
export const bulkDeleteSoldTickets = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/bulk-delete-sold-tickets/`, {
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

