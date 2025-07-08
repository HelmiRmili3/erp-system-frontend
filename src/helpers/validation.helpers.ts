export const triggerValidation = (v$:any, field: string) => {
    v$[field].$touch();
};