// Turns whatever the backend (or the network) returned into a readable message.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    if (error?.status === "FETCH_ERROR") {
        return "Cannot reach the server. Is the backend running on port 8080?";
    }

    const data = error?.data;

    if (typeof data === "string" && data) return data;

    if (data && typeof data === "object") {
        const message =
            data.message ??
            data.Error ??
            Object.values(data).find((v) => typeof v === "string");

        if (message) {
            // ResponseStatusException looks like: 409 CONFLICT "Email already exists"
            const quoted = /"(.*)"/.exec(message);
            return quoted ? quoted[1] : message;
        }
    }

    if (error?.status === 401) return "Invalid credentials or session expired.";
    if (error?.status === 403) return "You don't have permission to do that.";

    return fallback;
}

export const formatPrice = (value) => `₹${Number(value ?? 0).toFixed(2)}`;
