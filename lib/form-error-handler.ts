import toast from 'react-hot-toast';
import { ApiErrorResponse, HandleApiErrorOptions } from '@/types/api.types';

export function handleApiError<T extends Record<string, any>>(
    errorResponse: ApiErrorResponse,
    options: HandleApiErrorOptions<T>
) {
    const { setError, errorFieldMap = {}, showToast = true } = options;

    if (errorResponse.details) {
        Object.entries(errorResponse.details).forEach(([field, messages]) => {
            // @ts-expect-error Argument of type keyof T is not assignable to parameter of type
            setError(field as keyof T, {
                type: 'manual',
                message: (messages as string[])[0],
            });
        });
        return;
    }

    const errorMessage = errorResponse.error || errorResponse.message || 'Wystąpił błąd';
    let fieldMapped = false;

    for (const [keyword, fieldName] of Object.entries(errorFieldMap)) {
        if (errorMessage.toLowerCase().includes(keyword.toLowerCase())) {
            // @ts-expect-error Argument of type keyof T is not assignable to parameter of type
            setError(fieldName as keyof T, {
                type: 'manual',
                message: errorMessage,
            });
            fieldMapped = true;
            break;
        }
    }

    if (!fieldMapped && showToast) {
        toast.error(errorMessage);
    }
}