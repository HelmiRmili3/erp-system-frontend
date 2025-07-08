export interface ProfileUpdateRequest {
    first_name: string
    last_name: string
    address: string
    phone: string
}

export class UpdatePasswordRequest {
    current_password?: string
    password?: string
    confirm_password?: string
}
export class UpdateAddressRequest {
    streetName?: string
    houseNumber?: string
    postalCode?: string
}