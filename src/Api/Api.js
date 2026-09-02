const url = "https://brtc.pythonanywhere.com/api/"
// const url = "http://127.0.0.1:8000/api/"
async function getErrorMessage(response) {
    const { status } = response;
    let errorData = null;

    try {
        errorData = await response.clone().json();
    } catch {
        errorData = null;
    }

    if (errorData) {
        if (typeof errorData === "string") return errorData;
        if (errorData.detail) return errorData.detail;
        if (errorData.message) return errorData.message;
        const firstError = Object.values(errorData).flat().find(Boolean);
        if (firstError) return String(firstError);
    }

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
        const message = await getErrorMessage(response);
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

export const getTodayVerifierQueue = async (token, centerCode) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/today-sold-tickets/${centerCode}/`, {
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

export const createQueueAnnouncement = async (token, ticketId) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/queue-announcements/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ ticket_id: ticketId }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const getLatestQueueAnnouncement = async (token, signal) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/queue-announcements/latest/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
            cache: "no-store",
            signal,
        });
        return handleResponse(response);
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("API Error:", error.message);
        }
        throw error;
    }
};

export const bulkDeferVerifierTicket = async (token, data) => {
    try {
        const response = await fetch(`${url}ticket-management/verifier/bulk-defer-ticket/`, {
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

export const getTestCenters = async (token) => {
    try {
        const response = await fetch(`${url}ticket-management/test-centers/`, {
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

export const getTestCenterCounters = async (token, centerId) => {
    try {
        const response = await fetch(`${url}ticket-management/test-centers/${centerId}/counters/`, {
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

export const createTestCenterCounter = async (token, centerId, data) => {
    try {
        const response = await fetch(`${url}ticket-management/test-centers/${centerId}/counters/`, {
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

export const deleteTestCenterCounter = async (token, centerId, counterId) => {
    try {
        const response = await fetch(`${url}ticket-management/test-centers/${centerId}/counters/${counterId}/`, {
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

export const assignVerifierTestCenter = async (token, userId, data) => {
    try {
        const response = await fetch(`${url}account/verifiers/${userId}/assign-test-center/`, {
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

export const revokeVerifierTestCenter = async (token, userId) => {
    try {
        const response = await fetch(`${url}account/verifiers/${userId}/assign-test-center/`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ test_center_id: null }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const assignVerifierCounter = async (token, userId, data) => {
    try {
        const response = await fetch(`${url}account/verifiers/${userId}/assign-counter/`, {
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

export const revokeVerifierCounter = async (token, userId) => {
    try {
        const response = await fetch(`${url}account/verifiers/${userId}/assign-counter/`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ counter_id: null }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const getTodayAdminQueue = async (token, centerCode) => {
    try {
        const response = await fetch(`${url}ticket-management/admin/today-sold-tickets/${centerCode}/`, {
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

export const moveAdminQueueTicket = async (token, id, data) => {
    try {
        const response = await fetch(`${url}ticket-management/admin/queue-move-ticket/?id=${id}`, {
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

