export default function filterToTruthyObject(obj: Record<string, any>): any {
    return Object.fromEntries (
        Object.entries(obj).filter(([_, v]) => {
            return v != undefined && v != null && v != ""
        })
    );
}