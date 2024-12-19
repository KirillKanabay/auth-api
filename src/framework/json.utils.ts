export const tryParse = <T>(rawData: string) => {
    try {
        return { success: true, data: JSON.parse(rawData) as T };
    } catch {
        return { success: false, error: `Can't deserialize model` }
    }
}